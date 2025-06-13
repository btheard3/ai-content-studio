import * as React from "react";

export interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, ...props }, ref) => {
		return (
			<textarea
				className={`w-full p-2 border border-gray-300 rounded ${
					className || ""
				}`}
				ref={ref}
				{...props}
			/>
		);
	}
);
Textarea.displayName = "Textarea";
