CREATE TABLE `t_supply_box` (
    `id` int NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `nft_number` int NOT NULL COMMENT 'nft编号',
    `nft_batch_code` varchar(6) DEFAULT NULL COMMENT 'nft批次号（默认批次：000001）',
    `box_quantity` int NOT NULL DEFAULT '1' COMMENT '礼盒数量',
    `update_date` datetime DEFAULT NULL COMMENT '更新日期',
    `update_time` datetime DEFAULT NULL COMMENT '更新时间',
    `create_date` datetime DEFAULT NULL COMMENT '创建日期',
    `create_time` datetime DEFAULT NULL COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_nft_number` (`nft_number`) USING BTREE COMMENT 'nft编号'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='nft礼盒表';