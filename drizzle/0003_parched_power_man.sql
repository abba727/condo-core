CREATE TABLE `capital_stack_participants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trancheId` int NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`commitment` decimal(15,2) NOT NULL DEFAULT '0',
	`role` varchar(255),
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `capital_stack_participants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `csp_tranche_idx` ON `capital_stack_participants` (`trancheId`);--> statement-breakpoint
CREATE INDEX `csp_project_idx` ON `capital_stack_participants` (`projectId`);