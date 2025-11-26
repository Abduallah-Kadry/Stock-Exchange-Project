"use client";

import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Card, CardHeader, CardContent, CardTitle} from "@/components/ui/card";
import {useTheme} from "next-themes";
import { Moon, Sun } from 'lucide-react';

export default function RegisterPage() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordError, setPasswordError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [responseMsg, setResponseMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
	const {theme, setTheme} = useTheme();

	const handleRegister = async () => {
		if (!firstName || !lastName || !email || !password || !confirmPassword) {
			setResponseMsg({type: "error", text: "All fields are required"});
			return;
		}

		if (passwordError) {
			setResponseMsg({type: "error", text: passwordError});
			return;
		}

		try {
			setLoading(true);
			const res = await fetch("http://localhost:8080/api/v1/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({firstName, lastName, email, password}),
			});

			const data = await res.json();

			if (data.status === 200) {
				setResponseMsg({type: "success", text: data.message});
				setEmail("");
				setPassword("");
				setConfirmPassword("");
			} else {
				setResponseMsg({type: "error", text: data.message});
			}
		} catch (error) {
			console.log(error)
			const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
			setResponseMsg({type: "error", text: errorMessage});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-black dark:via-neutral-900 dark:to-neutral-800 transition-colors duration-300">
			<Card
				className="w-full max-w-md shadow-2xl backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/10 dark:border-white/10">
				<CardHeader>
					<CardTitle className="text-center text-2xl font-bold text-slate-900 dark:text-white">
						Create an Account
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="text-sm font-medium text-slate-700 dark:text-gray-300">First Name</label>
							<Input
								type="text"
								placeholder="First name"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								className="mt-1"
							/>
						</div>
						<div>
							<label className="text-sm font-medium text-slate-700 dark:text-gray-300">Last Name</label>
							<Input
								type="text"
								placeholder="Last name"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								className="mt-1"
							/>
						</div>
					</div>
					<div>
						<label className="text-sm font-medium text-slate-700 dark:text-gray-300">Email</label>
						<Input
							type="email"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="mt-1"
						/>
					</div>

					<div>
						<label className="text-sm font-medium text-slate-700 dark:text-gray-300">Password</label>
						<Input
							type="password"
							placeholder="Enter your password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="mt-1"
						/>
					</div>

					<div>
						<label className="text-sm font-medium text-slate-700 dark:text-gray-300">Confirm Password</label>
						<Input
							type="password"
							placeholder="Confirm your password"
							value={confirmPassword}
							onChange={(e) => {
								setConfirmPassword(e.target.value);
								if (e.target.value !== password) {
									setPasswordError("Passwords do not match");
								} else {
									setPasswordError(null);
								}
							}}
							className={`mt-1 ${passwordError ? 'border-red-500' : ''}`}
						/>
						{passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
					</div>

					{responseMsg && (
						<div
							className={`p-2 rounded-lg text-center text-sm font-medium ${
								responseMsg.type === "success"
									? "bg-green-600/20 text-green-300"
									: "bg-red-600/20 text-red-300"
							}`}
						>
							{responseMsg.text}
						</div>
					)}

					<Button
						onClick={handleRegister}
						disabled={loading}
						className="w-full py-2 text-lg rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
					>
						{loading ? "Creating account..." : "Register"}
					</Button>

				</CardContent>
			</Card>
		</div>
	);
}
