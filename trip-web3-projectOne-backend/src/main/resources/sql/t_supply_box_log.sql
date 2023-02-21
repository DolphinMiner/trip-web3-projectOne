CREATE TABLE `t_supply_box_log` (
    `id` int NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `nft_number` int DEFAULT NULL COMMENT 'nft编号',
    `nft_batch_code` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'nft批次号（默认批次：000001）',
    `type` tinyint(1) DEFAULT NULL COMMENT '类型：0-增加，1-扣减',
    `quantity` int DEFAULT NULL COMMENT '增加/扣减数量',
    `description` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '描述，来源/用途（Postcard兑换/官网抽奖使用）',
    `user_email` varchar(320) DEFAULT NULL COMMENT '用户邮箱',
    `ether_address` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '用户地址',
    `lottery_record_id` int DEFAULT NULL COMMENT '抽奖记录表id',
    `create_date` datetime DEFAULT NULL COMMENT '创建日期',
    `create_time` datetime DEFAULT NULL COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_nft_number` (`nft_number`) USING BTREE COMMENT 'nft编号',
    KEY `idx_user_email` (`user_email`) USING BTREE COMMENT '用户邮箱',
    KEY `idx_ether_address` (`ether_address`) USING BTREE COMMENT 'ether地址'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='nft礼盒日志表';