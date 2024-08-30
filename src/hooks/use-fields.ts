import { useMemo, useState } from 'react'
import { isEmpty } from 'lodash'

export interface Field {
  value?: string
  error?: string | null
  isRequired?: boolean
  validate?: (field: Field) => string | null
}

export type Fields<T extends Fields<T>> = Record<keyof T, Field>

export type FieldsValues<T extends Fields<T>> = Record<keyof T, string>

export const createField = (field?: Field) => ({
  value: '',
  error: null,
  isRequired: false,
  ...field,
})

/**
 * TODO/middle
 * @deprecated use `useForm` instead
 */
export const useFields = <T extends Fields<T>>(originFields: T) => {
  const [fields, setFields] = useState(originFields)

  const fieldsKeys = useMemo(() => {
    return Object.keys(fields).reduce((acc, key) => {
      acc[key as keyof T] = key
      return acc
    }, {} as Record<keyof T, string>)
  }, [fields])

  const fieldsValues = useMemo(() => {
    return Object.entries(fields).reduce((acc, [key, field]) => {
      acc[key as keyof T] = (field as Field).value ?? ''
      return acc
    }, {} as FieldsValues<T>)
  }, [fields])

  const updateField = (name: keyof T, field: Field) => {
    setFields((fields) => {
      const oldField = fields[name]
      const newField = {
        ...oldField,
        ...field,
        error: oldField.validate?.(field),
      }

      return { ...fields, [name]: newField }
    })
  }

  const validateFields = () => {
    const errors = Object.entries<Field>(fields).reduce((acc, [n, f]) => {
      const err = f?.validate?.(f)
      if (err) {
        acc.push(err)
        updateField(n as keyof T, f)
      }

      return acc
    }, [] as string[])

    return isEmpty(errors)
  }

  return {
    fields,
    fieldsKeys,
    fieldsValues,
    updateField,
    validateFields,
  }
}
