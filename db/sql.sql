CREATE TABLE `accounts` (
                            `id` bigint unsigned AUTO_INCREMENT NOT NULL,
                            `account_id` varchar(255) NOT NULL,
                            `provider_id` varchar(255) NOT NULL,
                            `user_id` bigint unsigned NOT NULL,
                            `access_token` text,
                            `refresh_token` text,
                            `id_token` text,
                            `access_token_expires_at` datetime(3),
                            `refresh_token_expires_at` datetime(3),
                            `scope` text,
                            `password` text,
                            `created_at` datetime(3) NOT NULL DEFAULT '2025-06-05 16:23:52.161',
                            `updated_at` datetime(3) NOT NULL DEFAULT '2025-06-05 16:23:52.161',
                            CONSTRAINT `accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cars` (
                        `id` bigint unsigned AUTO_INCREMENT NOT NULL,
                        `driver_id` bigint unsigned NOT NULL,
                        `brand` varchar(255),
                        `model` varchar(255),
                        `year` char(4),
                        `registration` varchar(255),
                        `available_seats` bigint unsigned,
                        `comfort` enum('standard','premium','luxury'),
                        `created_at` datetime(3) NOT NULL DEFAULT '2025-06-05 16:23:52.162',
                        `updated_at` datetime(3) NOT NULL DEFAULT '2025-06-05 16:23:52.162',
                        CONSTRAINT `cars_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cities` (
                          `id` bigint unsigned AUTO_INCREMENT NOT NULL,
                          `name` varchar(255),
                          `created_at` datetime(3) NOT NULL DEFAULT '2025-06-05 16:23:52.161',
                          `updated_at` datetime(3) NOT NULL DEFAULT '2025-06-05 16:23:52.161',
                          CONSTRAINT `cities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invitations` (
                               `id` bigint unsigned AUTO_INCREMENT NOT NULL,
                               `email` varchar(255) NOT NULL,
                               `inviter_id` bigint unsigned NOT NULL,
                               `organization_id` bigint unsigned NOT NULL,
                               `role` enum('user','driver','admin') DEFAULT 'user',
                               `status` enum('pending','accepted','rejected','declined','canceled') NOT NULL DEFAULT 'pending',
                               `expires_at` datetime(3),
                               `created_at` datetime(3) NOT NULL DEFAULT '2025-06-05 16:23:52.161',
                               `updated_at` datetime(3) NOT NULL DEFAULT '2025-06-05 16:23:52.161',
                               CONSTRAINT `invitations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `members` (
                           `id` bigint unsigned AUTO_INCREMENT NOT NULL,
                           `user_id` bigint unsigned NOT NULL,
                           `organization_id` bigint unsigned NOT NULL,
                           `role` enum('user','driver','admin') DEFAULT 'user',
                           `joined_at` datetime(3) DEFAULT '2025-06-05 16:23:52.161',
                           `left_at` datetime(3),
                           `created_at` datetime(3) NOT NULL DEFAULT '2025-06-05 16:23:52.161',
                           `updated_at` datetime(3) NOT NULL DEFAULT '2025-06-05 16:23:52.161',
                           CONSTRAINT `members_id` PRIMARY KEY(`id`),
                           CONSTRAINT `unique_user_org_idx` UNIQUE(`user_id`,`organization_id`)
);
--> statement-breakpoint
CREATE TABLE `organizations` (
                                 `id` bigint unsigned AUTO_INCREMENT NOT NULL,
                                 `name` varchar(255) NOT NULL,
                                 `slug` varchar(255) NOT NULL,
                                 `logo` text,
                                 `metadata` text,
                                 `created_at` datetime(3) NOT NULL DEFAULT '2025-06-05 16:23:52.160',
                                 `updated_at` datetime(3) NOT NULL DEFAULT '2025-06-05 16:23:52.160',
                                 CONSTRAINT `organizations_id` PRIMARY KEY(`id`),
                                 CONSTRAINT `organizations_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `rides` (
                         `id` bigint unsigned AUTO_INCREMENT NOT NULL,
                         `driver_id` bigint unsigned NOT NULL,
                         `car_id` bigint unsigned NOT NULL,
                         `place_of_departure` bigint unsigned NOT NULL,
                         `place_of_arrival` bigint unsigned NOT NULL,
                         `collection_point` varchar(255),
                         `drop_off_point` varchar(255),
                         `hour_of_departure` time,
                         `hour_of_arrival` time,
                         `date` date,
                         `duration` bigint unsigned,
                         `price` decimal(10,2),
                         `available_seats` bigint unsigned,
                         `description` text,
                         `status` enum('opened','completed','canceled','full'),
                         `created_at` datetime(3) NOT NULL DEFAULT '2025-06-05 16:23:52.162',
                         `updated_at` datetime(3) NOT NULL DEFAULT '2025-06-05 16:23:52.162',
                         CONSTRAINT `rides_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
                            `id` bigint unsigned AUTO_INCREMENT NOT NULL,
                            `user_id` bigint unsigned NOT NULL,
                            `token` varchar(255) NOT NULL,
                            `ip_address` text,
                            `user_agent` text,
                            `active_organization_id` bigint unsigned,
                            `impersonated_by` varchar(255),
                            `expires_at` datetime(3) NOT NULL,
                            `created_at` datetime(3) NOT NULL DEFAULT '2025-06-05 16:23:52.161',
                            `updated_at` datetime(3) NOT NULL DEFAULT '2025-06-05 16:23:52.161',
                            CONSTRAINT `sessions_id` PRIMARY KEY(`id`),
                            CONSTRAINT `sessions_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `users` (
                         `id` bigint unsigned AUTO_INCREMENT NOT NULL,
                         `name` varchar(255) NOT NULL,
                         `email` varchar(255) NOT NULL,
                         `email_verified` boolean NOT NULL DEFAULT false,
                         `image` text,
                         `banned` boolean NOT NULL DEFAULT false,
                         `ban_reason` varchar(255),
                         `ban_expires` datetime(3),
                         `nic_passport_number` varchar(255),
                         `phone` varchar(255),
                         `nic_passport_picture_1` varchar(255),
                         `nic_passport_picture_2` varchar(255),
                         `role` enum('user','driver','admin') DEFAULT 'user',
                         `validated` boolean NOT NULL DEFAULT false,
                         `created_at` datetime(3) NOT NULL DEFAULT '2025-06-05 16:23:52.159',
                         `updated_at` datetime(3) NOT NULL DEFAULT '2025-06-05 16:23:52.159',
                         CONSTRAINT `users_id` PRIMARY KEY(`id`),
                         CONSTRAINT `users_email_unique` UNIQUE(`email`),
                         CONSTRAINT `users_nic_passport_number_unique` UNIQUE(`nic_passport_number`),
                         CONSTRAINT `users_phone_unique` UNIQUE(`phone`)
);
--> statement-breakpoint
CREATE TABLE `verifications` (
                                 `id` bigint unsigned AUTO_INCREMENT NOT NULL,
                                 `identifier` text NOT NULL,
                                 `value` text NOT NULL,
                                 `expires_at` datetime(3) NOT NULL,
                                 `created_at` datetime(3) NOT NULL DEFAULT '2025-06-05 16:23:52.161',
                                 `updated_at` datetime(3) NOT NULL DEFAULT '2025-06-05 16:23:52.161',
                                 CONSTRAINT `verifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cars` ADD CONSTRAINT `cars_driver_id_users_id_fk` FOREIGN KEY (`driver_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invitations` ADD CONSTRAINT `invitations_inviter_id_users_id_fk` FOREIGN KEY (`inviter_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invitations` ADD CONSTRAINT `invitations_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `members` ADD CONSTRAINT `members_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `members` ADD CONSTRAINT `members_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rides` ADD CONSTRAINT `rides_driver_id_users_id_fk` FOREIGN KEY (`driver_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rides` ADD CONSTRAINT `rides_car_id_cars_id_fk` FOREIGN KEY (`car_id`) REFERENCES `cars`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rides` ADD CONSTRAINT `rides_place_of_departure_cities_id_fk` FOREIGN KEY (`place_of_departure`) REFERENCES `cities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rides` ADD CONSTRAINT `rides_place_of_arrival_cities_id_fk` FOREIGN KEY (`place_of_arrival`) REFERENCES `cities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_active_organization_id_organizations_id_fk` FOREIGN KEY (`active_organization_id`) REFERENCES `organizations`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `invitation_organization_id_idx` ON `invitations` (`organization_id`);--> statement-breakpoint
CREATE INDEX `invitation_email_idx` ON `invitations` (`email`);--> statement-breakpoint
CREATE INDEX `member_user_id_idx` ON `members` (`user_id`);--> statement-breakpoint
CREATE INDEX `member_organization_id_idx` ON `members` (`organization_id`);