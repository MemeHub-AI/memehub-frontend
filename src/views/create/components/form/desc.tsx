import { LuRefreshCcw } from 'react-icons/lu'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useCreateTokenForm } from '../../hooks/use-form'
import { Textarea } from '@/components/ui/textarea'
import { useAimemeInfoStore } from '@/stores/use-ai-meme-info-store'
import { useUserStore } from '@/stores/use-user-store'
import { aiApi } from '@/api/ai'
import { cn } from '@/lib/utils'
import { useAudioPlayer } from '@/hooks/use-audio-player'
import { useCheckAccount } from '@/hooks/use-check-chain'

interface Props {
  formData: ReturnType<typeof useCreateTokenForm>
}

let memeDescAbort = new AbortController()

export const Description = ({ formData }: Props) => {
  const { form, formFields } = formData
  const { t } = useTranslation()
  const { loadingDesc, setLoadingDesc } = useAimemeInfoStore()
  const userStore = useUserStore()
  const { playGuaGua } = useAudioPlayer()
  const { checkForConnect } = useCheckAccount()

  const createDesc = (e: any) => {
    e.stopPropagation()
    e.preventDefault()

    if (!checkForConnect()) return
    if (form.getValues(formFields?.fullname) === '') {
      toast.warning(t('need.base.info.warning'))
      return
    }
    setLoadingDesc(true)
  }

  const fetchMemeLogo = () => {
    memeDescAbort.abort()
    memeDescAbort = new AbortController()
    aiApi
      .getMemeInfo(
        {
          input: form.getValues(formFields.fullname)! as string,
          type: 1,
        },
        memeDescAbort.signal
      )
      .then(({ data }) => {
        if (data) {
          form.setValue(formFields.description, data.description!)
        }
      })
      .finally(() => {
        setLoadingDesc(false)
      })
  }

  useEffect(() => {
    if (loadingDesc) {
      playGuaGua()
      fetchMemeLogo()
    }
  }, [loadingDesc])

  useEffect(() => {
    return () => {
      memeDescAbort.abort('')
    }
  }, [])

  return (
    <FormField
      control={form?.control}
      name={formFields?.description!}
      render={({ field }) => (
        <FormItem className="max-w-[500px]">
          <FormLabel className="font-bold flex items-center">
            *{t('description')}
            <LuRefreshCcw
              className={cn(
                'ml-2',
                loadingDesc ? 'animate-spin' : 'cursor-pointer'
              )}
              title="Regenerate"
              onClick={createDesc}
            />
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder={t('description.placeholder')}
              rows={5}
              {...field}
              disabled={loadingDesc}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
