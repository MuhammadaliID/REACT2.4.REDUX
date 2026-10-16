import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUsers, addUser, deleteUser, editUser } from './Store/RTK'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import './App.css'

let schema = z.object({
    name: z.string().min(3, 'Минимум 3 символа'),
    age: z.coerce.number().min(18, 'Возраст должен быть не меньше 18')
})

function App() {
    let dispatch = useDispatch()
    let { data } = useSelector((state) => state.users)

    let [open, setOpen] = useState(false)
    let [editOpen, setEditOpen] = useState(false)
    let [selectedUser, setSelectedUser] = useState(null)

    let { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    })

    let { register: editRegister, handleSubmit: editHandleSubmit, reset: editReset, formState: { errors: editErrors } } = useForm({
        resolver: zodResolver(schema)
    })

    useEffect(() => {
        dispatch(getUsers())
    }, [dispatch])

    // ADD
    function onSubmit(user) {
        dispatch(addUser(user)).unwrap().then(() => {
            reset()
            setOpen(false)
        }).catch((error) => {
            console.log(error)
        })
    }

    // OPEN EDIT DIALOG
    function openEdit(user) {
        setSelectedUser(user)
        editReset({
            name: user.name,
            age: user.age
        })
        setEditOpen(true)
    }

    // EDIT
    function onEdit(user) {
        dispatch(editUser({
            ...user,
            id: selectedUser.id
        })).unwrap().then(() => {
            editReset()
            setEditOpen(false)
            setSelectedUser(null)
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <div>
            <h1>Users</h1>

            {/* ADD DIALOG */}
            <button onClick={() => setOpen(true)}>Add User</button>

            <dialog open={open}>
                <h2>Add User</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <input {...register('name')} placeholder="Name" />
                    <p style={{ color: 'red' }}>{errors.name?.message}</p>

                    <input {...register('age')} type="number" placeholder="Age" />
                    <p style={{ color: 'red' }}>{errors.age?.message}</p>

                    <button type="submit">Save</button>
                    <button type="button" onClick={() => {
                        reset()
                        setOpen(false)
                    }}>Close</button>
                </form>
            </dialog>

            {/* EDIT DIALOG */}
            <dialog open={editOpen}>
                <h2>Edit User</h2>

                <form onSubmit={editHandleSubmit(onEdit)}>
                    <input {...editRegister('name')} placeholder="Name" />
                    <p style={{ color: 'red' }}>{editErrors.name?.message}</p>

                    <input {...editRegister('age')} type="number" placeholder="Age" />
                    <p style={{ color: 'red' }}>{editErrors.age?.message}</p>

                    <button type="submit">Update</button>
                    <button type="button" onClick={() => {
                        editReset()
                        setEditOpen(false)
                        setSelectedUser(null)
                    }}>Close</button>
                </form>
            </dialog>

            {/* USERS */}
            {data.map((user) => (
                <div key={user.id}>
                    <h3>{user.name}</h3>
                    <h2>{user.age} years</h2>
                    <h3>{user.status ? 'Active' : 'Inactive'}</h3>

                    <button onClick={() => openEdit(user)}>Edit</button>
                    <button onClick={() => dispatch(deleteUser(user.id))}>Delete</button>

                    <hr />
                </div>
            ))}
        </div>
    )
}

export default App