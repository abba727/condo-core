CREATE TABLE `vendor_audit_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vendorId` int NOT NULL,
	`action` varchar(64) NOT NULL,
	`detail` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vendor_audit_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vendor_cois` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vendorId` int NOT NULL,
	`type` varchar(128),
	`carrier` varchar(255),
	`policyNumber` varchar(128),
	`expires` varchar(32),
	`status` enum('active','expired','expiring_soon') NOT NULL DEFAULT 'active',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vendor_cois_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `vendors` ADD `ein` varchar(32);--> statement-breakpoint
ALTER TABLE `vendors` ADD `rating` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `vendors` ADD `paid` decimal(15,2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE `vendors` ADD `contractValue` decimal(15,2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE `vendors` ADD `coiExpires` varchar(64) DEFAULT 'Not tracked';--> statement-breakpoint
ALTER TABLE `vendors` ADD `coiOk` boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE `vendors` ADD `archived` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `vendors` ADD `archivedAt` timestamp;--> statement-breakpoint
CREATE INDEX `audit_vendor_idx` ON `vendor_audit_log` (`vendorId`);--> statement-breakpoint
CREATE INDEX `cois_vendor_idx` ON `vendor_cois` (`vendorId`);