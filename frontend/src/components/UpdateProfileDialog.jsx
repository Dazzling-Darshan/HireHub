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
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
        fullName: user?.fullName || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(', ') || "",
        file: null
    });
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();

    // Synchronize form whenever dialog opens or user state updates
    React.useEffect(() => {
        if (open && user) {
            setInput({
                fullName: user?.fullName || "",
                email: user?.email || "",
                phoneNumber: user?.phoneNumber || "",
                bio: user?.profile?.bio || "",
                skills: user?.profile?.skills?.join(', ') || "",
                file: null
            });
            setErrors({});
        }
    }, [open, user]);

    const validate = () => {
        const newErrors = {};
        if (!input.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        } else if (input.fullName.trim().length < 2) {
            newErrors.fullName = "Full name must be at least 2 characters";
        } else if (input.fullName.trim().length > 100) {
            newErrors.fullName = "Full name cannot exceed 100 characters";
        }
        
        // Email check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!input.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(input.email.trim())) {
            newErrors.email = "Please enter a valid email address";
        }

        if (input.bio && input.bio.length > 500) {
            newErrors.bio = "Bio cannot exceed 500 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

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
            );

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message || "Profile updated successfully!");
                setOpen(false);
            }

        } catch (error) {
            console.error("Profile update error:", error);
            const errorMsg = error.response?.data?.message || "Failed to update profile";
            toast.error(errorMsg);

            if (error.response?.status === 401) {
                dispatch(setUser(null));
                setOpen(false);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Dialog open={open}>
                <DialogContent
                    className="sm:max-w-lg rounded-3xl p-8 shadow-2xl border border-border bg-card"
                    onInteractOutside={() => setOpen(false)}
                >

                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-foreground">
                            Update Profile
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={submitHandler}>
                        <div className='grid gap-6 py-4'>

                            <div className='space-y-2'>
                                <Label htmlFor="name" className="text-foreground font-semibold">Full Name <span className="text-xs text-muted-foreground font-normal">({input.fullName.length}/100)</span></Label>
                                <Input
                                    id="name"
                                    name="fullName"
                                    value={input.fullName}
                                    onChange={changeEventHandler}
                                    maxLength={100}
                                    className={`rounded-xl bg-muted/50 transition-all ${errors.fullName ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : 'border-border focus:ring-primary/20 focus:border-primary'}`}
                                />
                                {errors.fullName && (
                                    <p className="text-sm font-medium text-destructive">{errors.fullName}</p>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor="email" className="text-foreground font-semibold">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    value={input.email}
                                    onChange={changeEventHandler}
                                    className={`rounded-xl bg-muted/50 transition-all ${errors.email ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : 'border-border focus:ring-primary/20 focus:border-primary'}`}
                                />
                                {errors.email && (
                                    <p className="text-sm font-medium text-destructive">{errors.email}</p>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor="number" className="text-foreground font-semibold">Phone Number</Label>
                                <Input
                                    id="number"
                                    name="phoneNumber"
                                    value={input.phoneNumber}
                                    onChange={changeEventHandler}
                                    className={`rounded-xl bg-muted/50 transition-all ${errors.phoneNumber ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : 'border-border focus:ring-primary/20 focus:border-primary'}`}
                                />
                                {errors.phoneNumber && (
                                    <p className="text-sm font-medium text-destructive">{errors.phoneNumber}</p>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor="bio" className="text-foreground font-semibold">Bio <span className="text-xs text-muted-foreground font-normal">({input.bio.length}/500)</span></Label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={input.bio}
                                    onChange={changeEventHandler}
                                    maxLength={500}
                                    rows={3}
                                    className={`w-full rounded-xl px-4 py-3 border bg-muted/50 transition-all ${errors.bio ? 'border-destructive focus:ring-2 focus:ring-destructive/20 focus:border-destructive outline-none' : 'border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none'}`}
                                />
                                {errors.bio && (
                                    <p className="text-sm font-medium text-destructive">{errors.bio}</p>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor="skills" className="text-foreground font-semibold">Skills <span className="text-xs text-muted-foreground font-normal">(comma-separated)</span></Label>
                                <Input
                                    id="skills"
                                    name="skills"
                                    value={input.skills}
                                    onChange={changeEventHandler}
                                    placeholder="React, Node.js, JavaScript"
                                    className="rounded-xl bg-muted/50 transition-all border-border focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>

                            {/* File Input (fixed UI) */}
                            <div className='space-y-2'>
                                <Label htmlFor="file" className="text-foreground font-semibold">Resume <span className="text-xs text-muted-foreground font-normal">(PDF only, optional)</span></Label>
                                <input
                                    id="file"
                                    name="file"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={fileChangeHandler}
                                    className="text-sm cursor-pointer border border-border rounded-xl px-4 py-2.5 w-full bg-muted/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all"
                                />
                            </div>

                        </div>

                        <DialogFooter className="flex gap-4 mt-6">
                            <Button 
                                variant="outline" 
                                onClick={() => setOpen(false)} 
                                type="button"
                                className="border-border hover:bg-muted rounded-xl px-6"
                            >
                                Cancel
                            </Button>
                            {
                                loading ? (
                                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all duration-300 shadow-md px-6">
                                        <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                                        Please wait
                                    </Button>
                                ) : (
                                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 px-6">
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
