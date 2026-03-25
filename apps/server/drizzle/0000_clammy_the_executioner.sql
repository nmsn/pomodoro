CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`name` text,
	`avatar_url` text,
	`github_id` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `user_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`theme` text DEFAULT 'system',
	`background` text DEFAULT 'default',
	`work_duration` integer DEFAULT 25,
	`break_duration` integer DEFAULT 5,
	`timer_type` text DEFAULT 'pomodoro',
	`sound_enabled` integer DEFAULT true,
	`notifications_enabled` integer DEFAULT true,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pomodoro_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`timer_type` text NOT NULL,
	`mode` text NOT NULL,
	`start_time` integer NOT NULL,
	`end_time` integer,
	`duration` integer DEFAULT 0 NOT NULL,
	`completed` integer DEFAULT false,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `daily_stats` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`date` text NOT NULL,
	`total_focus_minutes` integer DEFAULT 0,
	`completed_pomodoros` integer DEFAULT 0,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
