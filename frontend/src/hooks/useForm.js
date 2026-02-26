import { useState } from 'react'

export function useForm(initialValues) {
    const [form, setForm] = useState(initialValues)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        setError('')
    }

    return { form, error, setError, loading, setLoading, handleChange }
}