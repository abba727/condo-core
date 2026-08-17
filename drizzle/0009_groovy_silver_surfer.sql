CREATE TABLE `vendor_contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vendorId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`role` varchar(128),
	`email` varchar(320),
	`phone` varchar(32),
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vendor_contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `contacts_vendor_idx` ON `vendor_contacts` (`vendorId`);