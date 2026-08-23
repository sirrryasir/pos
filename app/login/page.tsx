"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Package2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const { data, error } = await authClient.signIn.email({
            email,
            password,
        });

        if (error) {
            setError(error.message || "Invalid email or password");
            setLoading(false);
        } else {
            router.push("/");
            router.refresh();
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-background relative overflow-hidden p-4">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-[380px] relative z-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 mb-4 shadow-[0_0_15px_rgba(var(--primary),0.1)]">
                        <Package2 className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome Back</h1>
                    <p className="text-muted-foreground mt-2 text-sm text-center">
                        Enter your credentials to access the POS system
                    </p>
                </div>

                <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-6 sm:p-8 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-foreground/80">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-background/50 border-border/50 h-12 px-4 rounded-xl focus-visible:ring-primary/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-foreground/80">Password</Label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-background/50 border-border/50 h-12 px-4 rounded-xl focus-visible:ring-primary/50"
                            />
                        </div>

                        {error && (
                            <div className="bg-destructive/10 text-destructive border border-destructive/20 text-sm px-4 py-3 rounded-xl">
                                {error}
                            </div>
                        )}

                        <Button 
                            className="w-full h-12 rounded-xl text-base font-medium shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all hover:shadow-[0_0_25px_rgba(var(--primary),0.5)]" 
                            type="submit" 
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign in to Dashboard"}
                        </Button>

                        <Button 
                            className="w-full h-12 rounded-xl text-base font-medium" 
                            type="button" 
                            variant="outline"
                            onClick={() => {
                                setEmail("admin@pos.com");
                                setPassword("password123");
                            }}
                        >
                            Auto-Fill Demo Credentials
                        </Button>
                    </form>
                </div>
                
                <div className="mt-8 text-center text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} POS. All rights reserved.
                </div>
            </div>
        </div>
    );
}
