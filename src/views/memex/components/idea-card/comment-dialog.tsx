import { type ComponentProps } from 'react'
import { HeartFilledIcon } from '@radix-ui/react-icons'
import { useTranslation } from 'react-i18next'

import { Dialog, DialogFooter, DialogTitle } from '@/components/ui/dialog'
import { Form, FormField } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useIdeaCardContext } from '@/contexts/memex/idea-card'
import { useCommentForm } from '../../idea/hooks/use-comment-form'

interface Props {
  onCommentSuccess?: VoidFunction
}

export const CommentDialog = ({
  open,
  onOpenChange,
  onCommentSuccess,
}: ComponentProps<typeof Dialog> & Props) => {
  const { t } = useTranslation()
  const { idea } = useIdeaCardContext()

  const { form, isPending, onSubmit } = useCommentForm(
    idea?.hash || '',
    onCommentSuccess
  )

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      contentProps={{
        className: 'p-0',
        showClose: false,
        onClick: (e) => e.stopPropagation(),
      }}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center p-6 space-y-3"
        >
          <DialogTitle>{t('like-success')}</DialogTitle>
          <HeartFilledIcon className="w-20 h-20 text-red-500" />

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <Textarea
                autoFocus
                rows={5}
                placeholder={t('post-comment')}
                {...field}
              />
            )}
          />

          <DialogFooter className="flex-row space-x-4">
            <Button
              variant="yellow"
              shadow="none"
              size="sm"
              type="submit"
              disabled={isPending}
            >
              {isPending ? t('comment.loading') : t('confirm')}
            </Button>
            <Button
              type="button"
              shadow="none"
              size="sm"
              disabled={isPending}
              onClick={() => onOpenChange?.(false)}
            >
              {t('cancel')}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </Dialog>
  )
}

export default CommentDialog
