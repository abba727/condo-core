CREATE TABLE `vendor_documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vendorId` int NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`fileName` varchar(500) NOT NULL,
	`fileKey` varchar(1000),
	`fileUrl` varchar(2000),
	`fileSize` int,
	`mimeType` varchar(255),
	`description` varchar(1000),
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vendor_documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `vendor_docs_vendor_idx` ON `vendor_documents` (`vendorId`);--> statement-breakpoint
CREATE INDEX `vendor_docs_project_idx` ON `vendor_documents` (`projectId`);