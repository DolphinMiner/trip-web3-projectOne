DROP TABLE web3.`t_lottery_record`;
CREATE TABLE web3.`t_lottery_record` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '序列号',
  `nft_number` int(10) DEFAULT NULL COMMENT 'nft编号',
  `nft_batch_code` varchar(6) DEFAULT NULL COMMENT 'nft批次号',
  `user_email` varchar(320) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '登录邮箱地址',
  `ether_address` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '账户地址',
  `prize_level` tinyint(4) NOT NULL COMMENT '1-一等奖；2-二等奖；3-三等奖；4-四等奖；5-五等奖；6-六等奖；...',
  `prize_status` tinyint(4) DEFAULT '0' COMMENT '0-未兑换；1-兑换中；2-已兑换；3-放弃兑奖；',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '备注',
  `lottery_date` datetime DEFAULT NULL COMMENT '抽奖日期',
  `lottery_time` datetime DEFAULT NULL COMMENT '抽奖时间',
  `update_date` datetime DEFAULT NULL COMMENT '更新日期',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `reserved1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '备用1',
  `reserved2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '备用2',
  `reserved3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '备用3',
  PRIMARY KEY (`id`),
  KEY `idx_ether_address` (`ether_address`) USING BTREE COMMENT '以太坊地址',
  KEY `idx_user_email` (`user_email`) USING BTREE COMMENT '邮箱',
  KEY `idx_lottery_date` (`lottery_date`,`lottery_time`) USING BTREE COMMENT '抽奖时间',
  KEY `idx_nft_number` (`nft_number`) COMMENT 'nft编号'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='抽奖记录表';
