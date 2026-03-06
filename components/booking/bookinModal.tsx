"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    MapPin,
    Calendar,
    Home,
    Phone,
    Mail,
    TruckIcon,
    CheckCircle2,
    MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PlacesInput from "@/components/shared/PlacesInput";

// --- Constants ---

const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdIKO0-i-aUN72r8RXzkf8OLCv5AWfJf9AJhVLDV3wr4estvQ/formResponse";

const SERVICE_OPTIONS = [
    { value: "Small Pickup & Drop", label: "Small Pickup & Drop", description: "Quick transport" },
    { value: "Office Moving", label: "Office Moving", description: "Commercial Space" },
    { value: "Bike Pickup", label: "Bike Pickup", description: "Bikes & Scooters" },
    { value: "Rubbish Pickup", label: "Rubbish Pickup", description: "Waste Removal" },
    { value: "1 BHK", label: "1 BHK", description: "1 Bedroom" },
    { value: "2 BHK", label: "2 BHK", description: "2 Bedrooms" },
    { value: "3 BHK", label: "3 BHK", description: "3 Bedrooms" },
];

// --- Types ---

interface BookingFormData {
    fromAddress: string;
    toAddress: string;
    phone: string;
    email: string;
    moveDate: string;
    houseSize: string;
    queries: string;
}

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialFromAddress?: string;
    initialToAddress?: string;
    initialServiceType?: string;
}

// --- Component ---

export default function BookingModal({
    isOpen,
    onClose,
    initialFromAddress = "",
    initialToAddress = "",
    initialServiceType = "Small Pickup & Drop",
}: BookingModalProps) {
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [fromAddr, setFromAddr] = useState(initialFromAddress);
    const [toAddr, setToAddr] = useState(initialToAddress);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm<BookingFormData>({
        defaultValues: {
            fromAddress: initialFromAddress,
            toAddress: initialToAddress,
            moveDate: "",
            houseSize: initialServiceType,
            phone: "",
            email: "",
            queries: "",
        },
    });

    // Re-populate service type when modal opens
    useEffect(() => {
        if (isOpen && initialServiceType) {
            setValue("houseSize", initialServiceType);
        }
    }, [isOpen, initialServiceType, setValue]);

    const watchedHouseSize = watch("houseSize") ?? "Small Pickup & Drop";

    // Keep RHF in sync
    useEffect(() => { setValue("fromAddress", fromAddr, { shouldValidate: !!fromAddr }); }, [fromAddr, setValue]);
    useEffect(() => { setValue("toAddress", toAddr, { shouldValidate: !!toAddr }); }, [toAddr, setValue]);

    // Re-populate when hero pre-fills addresses
    useEffect(() => {
        if (isOpen) {
            setFromAddr(initialFromAddress);
            setToAddr(initialToAddress);
            setValue("fromAddress", initialFromAddress);
            setValue("toAddress", initialToAddress);
        }
    }, [isOpen, initialFromAddress, initialToAddress, setValue]);

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                reset();
                setFromAddr("");
                setToAddr("");
                setSubmitted(false);
                setError("");
            }, 300);
        }
    }, [isOpen, reset]);

    const onSubmit = async (data: BookingFormData) => {
        setIsSubmitting(true);
        setError("");

        try {
            const formData = new URLSearchParams();
            formData.append("entry.823080178", data.fromAddress);
            formData.append("entry.38844516", data.toAddress);
            formData.append("entry.1960254721", data.moveDate);
            formData.append("entry.1759539138", data.phone);
            formData.append("entry.660723823", data.email);
            formData.append("entry.1873214686", data.houseSize);
            formData.append("entry.1596771475", data.queries || "No additional queries");

            // Submit to Google Forms
            await fetch(GOOGLE_FORM_URL, {
                method: "POST",
                mode: "no-cors",
                body: formData,
            });

            // Send email notification (don't block on failure)
            try {
                await fetch("/api/send-email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        fromAddress: data.fromAddress,
                        toAddress: data.toAddress,
                        moveDate: data.moveDate,
                        phone: data.phone,
                        email: data.email,
                        houseSize: data.houseSize,
                        queries: data.queries || "No additional queries",
                    }),
                });
            } catch (emailErr) {
                console.error("Email notification failed:", emailErr);
                // Don't show error to user - form was already submitted to Google
            }

            // Success - clear form and show success
            reset();
            setFromAddr("");
            setToAddr("");
            setSubmitted(true);
        } catch (err) {
            setError("Something went wrong. Please try again or call us at 0452 649 320.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFromChange = (v: string) => { setFromAddr(v); };
    const handleToChange = (v: string) => { setToAddr(v); };

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split("T")[0];

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-135 max-h-[90vh] overflow-y-auto">

                {submitted ? (
                    // Success
                    <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                        <CheckCircle2 className="size-16 text-green-500" />
                        <DialogTitle className="text-2xl font-bold">Booking Requested!</DialogTitle>
                        <p className="text-muted-foreground text-sm max-w-xs">
                            Your removal request has been submitted. We&apos;ll contact you shortly to confirm your booking.
                        </p>
                        <Button className="mt-2 w-full" onClick={onClose}>Done</Button>
                    </div>

                ) : (
                    // Form
                    <>
                        <DialogHeader>
                            <div className="flex items-center gap-2">
                                <TruckIcon className="size-5 text-primary" />
                                <DialogTitle className="text-2xl font-bold">Book a Removal</DialogTitle>
                            </div>
                            <DialogDescription>
                                Fill in the details and we&apos;ll get back to you with a quote.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-1">

                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {/* From Address */}
                            <div className="space-y-1.5">
                                <Label className="flex items-center gap-1.5">
                                    <MapPin className="size-3.5 text-muted-foreground" /> From Address
                                </Label>
                                <PlacesInput
                                    value={fromAddr}
                                    onChange={handleFromChange}
                                    placeholder="e.g. 123 Main Street, Sydney"
                                    hasError={!!errors.fromAddress}
                                />
                                <input type="hidden" {...register("fromAddress", {
                                    required: "From address is required",
                                    minLength: { value: 5, message: "Please enter a valid address" },
                                    validate: (v) => (v && v.trim().length >= 5) || "From address is required",
                                })} />
                                {errors.fromAddress && <p className="text-xs text-red-500">{errors.fromAddress.message}</p>}
                            </div>

                            {/* To Address */}
                            <div className="space-y-1.5">
                                <Label className="flex items-center gap-1.5">
                                    <MapPin className="size-3.5 text-primary" /> To Address
                                </Label>
                                <PlacesInput
                                    value={toAddr}
                                    onChange={handleToChange}
                                    placeholder="e.g. 456 New Road, Melbourne"
                                    hasError={!!errors.toAddress}
                                />
                                <input type="hidden" {...register("toAddress", {
                                    required: "To address is required",
                                    minLength: { value: 5, message: "Please enter a valid address" },
                                    validate: (v) => (v && v.trim().length >= 5) || "To address is required",
                                })} />
                                {errors.toAddress && <p className="text-xs text-red-500">{errors.toAddress.message}</p>}
                            </div>

                            {/* Move Date */}
                            <div className="space-y-1.5">
                                <Label htmlFor="moveDate" className="flex items-center gap-1.5">
                                    <Calendar className="size-3.5 text-muted-foreground" /> Move Date
                                </Label>
                                <Input
                                    id="moveDate"
                                    type="date"
                                    min={minDate}
                                    {...register("moveDate", { required: "Move date is required" })}
                                    className={cn(errors.moveDate && "border-red-400")}
                                />
                                {errors.moveDate && <p className="text-xs text-red-500">{errors.moveDate.message}</p>}
                            </div>

                            {/* Phone */}
                            <div className="space-y-1.5">
                                <Label htmlFor="phone" className="flex items-center gap-1.5">
                                    <Phone className="size-3.5 text-muted-foreground" /> Contact Phone
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="e.g. 0452 649 320"
                                    {...register("phone", {
                                        required: "Phone number is required",
                                        minLength: { value: 7, message: "Enter a valid phone number" },
                                    })}
                                    className={cn(errors.phone && "border-red-400")}
                                />
                                {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="flex items-center gap-1.5">
                                    <Mail className="size-3.5 text-muted-foreground" /> Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="e.g. yourname@gmail.com"
                                    {...register("email", {
                                        required: "Email address is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Enter a valid email address",
                                        },
                                    })}
                                    className={cn(errors.email && "border-red-400")}
                                />
                                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                            </div>

                            {/* Service Type */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-1.5">
                                    <Home className="size-3.5 text-muted-foreground" /> Service Type
                                </Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {SERVICE_OPTIONS.map((opt) => {
                                        const isSelected = watchedHouseSize === opt.value;
                                        return (
                                            <label key={opt.value} className={cn(
                                                "flex flex-col gap-0.5 rounded-lg border p-3 cursor-pointer transition-colors",
                                                isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                                            )}>
                                                <input type="radio" value={opt.value} className="sr-only"
                                                    {...register("houseSize", { required: true })} />
                                                <span className="font-semibold text-sm">{opt.label}</span>
                                                <span className="text-xs text-muted-foreground">{opt.description}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Additional Queries */}
                            <div className="space-y-1.5">
                                <Label htmlFor="queries" className="flex items-center gap-1.5">
                                    <MessageSquare className="size-3.5 text-muted-foreground" /> Additional Information (Optional)
                                </Label>
                                <textarea
                                    id="queries"
                                    placeholder="Any special requirements or questions?"
                                    {...register("queries")}
                                    className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting…" : "Request Removal"}
                            </Button>

                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
