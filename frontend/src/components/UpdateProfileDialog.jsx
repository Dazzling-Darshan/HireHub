import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { USER_API_ENDPOINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import axios from 'axios'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {

    const [loading, setLoading] = useState(false)
    const { user } = useSelector(store => store.auth)

    const [input, setInput] = useState({
        fullName: user?.fullName || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(', ') || "",
        file: null
    })
    const [errors, setErrors] = useState({})

    const dispatch = useDispatch();

    const validate = () => {
        const newErrors = {}
        if (!input.fullName.trim()) {
            newErrors.fullName = "Full name is required"
        } else if (input.fullName.trim().length < 2) {
            newErrors.fullName = "Full name must be at least 2 characters"
        } else if (input.fullName.trim().length > 100) {
            newErrors.fullName = "Full name cannot exceed 100 characters"
        }
        
        // Email regex check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!input.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!emailRegex.test(input.email.trim())) {
            newErrors.email = "Please enter a valid email"
        }

        if (!input.phoneNumber.trim()) {
            newErrors.phoneNumber = "Phone number is required"
        }
        
        if (input.bio.length > 500) {
            newErrors.bio = "Bio cannot exceed 500 characters"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const changeEventHandler = (e) => {
        const { name, value } = e.target
        setInput({
            ...input,
            [name]: value
        })
        // Clear error for this field
        if (errors[name]) {
            const tempErrors = { ...errors }
            delete tempErrors[name]
            setErrors(tempErrors)
        }
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file })
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        
        setLoading(true);

        const formData = new FormData();
        formData.append("fullName", input.fullName.trim());
        formData.append("email", input.email.trim());
        formData.append("phoneNumber", input.phoneNumber.trim());
        formData.append("bio", input.bio.trim());
        formData.append("skills", input.skills.trim());

        if (input.file) {
            formData.append("file", input.file);
        }

        try {

            setLoading(true);
            const res = await axios.post(
                `${USER_API_ENDPOINT}/profile/update`,
                formData,
                { withCredentials: true }
            )

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <div>
            <Dialog open={open}>
                <DialogContent
                    className="sm:max-w-lg rounded-2xl p-6 shadow-2xl border border-[#E2E8F0]"
                    onInteractOutside={() => setOpen(false)}
                >

                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-[#0F172A]">
                            Update Profile
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={submitHandler}>
                        <div className='grid gap-5 py-4'>

                            <div className='space-y-2'>
                                <Label htmlFor="name" className="text-[#0F172A]">Full Name <span className="text-xs text-[#64748B]">({input.fullName.length}/100)</span></Label>
                                <Input
                                    id="name"
                                    name="fullName"
                                    value={input.fullName}
                                    onChange={changeEventHandler}
                                    maxLength={100}
                                    className={`rounded-lg ${errors.fullName ? 'border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]' : 'border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]'}`}
                                />
                                {errors.fullName && (
                                    <p className="text-sm font-medium text-[#EF4444]">{errors.fullName}</p>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor="email" className="text-[#0F172A]">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    value={input.email}
                                    onChange={changeEventHandler}
                                    className={`rounded-lg ${errors.email ? 'border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]' : 'border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]'}`}
                                />
                                {errors.email && (
                                    <p className="text-sm font-medium text-[#EF4444]">{errors.email}</p>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor="number" className="text-[#0F172A]">Phone Number</Label>
                                <Input
                                    id="number"
                                    name="phoneNumber"
                                    value={input.phoneNumber}
                                    onChange={changeEventHandler}
                                    className={`rounded-lg ${errors.phoneNumber ? 'border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]' : 'border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]'}`}
                                />
                                {errors.phoneNumber && (
                                    <p className="text-sm font-medium text-[#EF4444]">{errors.phoneNumber}</p>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor="bio" className="text-[#0F172A]">Bio <span className="text-xs text-[#64748B]">({input.bio.length}/500)</span></Label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={input.bio}
                                    onChange={changeEventHandler}
                                    maxLength={500}
                                    rows={3}
                                    className={`w-full rounded-md px-3 py-2 border ${errors.bio ? 'border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20 focus:border-[#EF4444] outline-none' : 'border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none'} bg-white`}
                                />
                                {errors.bio && (
                                    <p className="text-sm font-medium text-[#EF4444]">{errors.bio}</p>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor="skills" className="text-[#0F172A]">Skills <span className="text-xs text-[#64748B]">(comma-separated)</span></Label>
                                <Input
                                    id="skills"
                                    name="skills"
                                    value={input.skills}
                                    onChange={changeEventHandler}
                                    placeholder="React, Node.js, JavaScript"
                                    className="rounded-lg border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                                />
                            </div>

                            {/* File Input (fixed UI) */}
                            <div className='space-y-2'>
                                <Label htmlFor="file" className="text-[#0F172A]">Resume <span className="text-xs text-[#64748B]">(PDF only, optional)</span></Label>
                                <input
                                    id="file"
                                    name="file"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={fileChangeHandler}
                                    className="text-sm cursor-pointer border border-[#E2E8F0] rounded-lg px-3 py-2 w-full"
                                />
                            </div>

                        </div>

                        <DialogFooter className="flex gap-3">
                            <Button 
                                variant="outline" 
                                onClick={() => setOpen(false)} 
                                type="button"
                                className="border-[#E2E8F0] hover:bg-[#F8FAFC]"
                            >
                                Cancel
                            </Button>
                            {
                                loading ? (
                                    <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium rounded-lg transition-all duration-300 shadow-sm">
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Please wait
                                    </Button>
                                ) : (
                                    <Button type="submit" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium rounded-lg transition-all duration-300 shadow-sm">
                                        Update Profile
                                    </Button>
                                )
                            }
                        </DialogFooter>

                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UpdateProfileDialog
