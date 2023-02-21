DROP TABLE web3.`t_lottery_user_info`;
CREATE TABLE web3.`t_lottery_user_info` (
  `id` int(10) NOT NULL COMMENT '主键id',
  `user_email` varchar(320) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '邮箱地址',
  `ether_address` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '以太坊地址',
  `full_name` varchar(255) DEFAULT NULL COMMENT '全名',
  `phone_number` varchar(20) DEFAULT NULL COMMENT '电话号码',
  `province` varchar(255) DEFAULT NULL COMMENT '省/地区',
  `city` varchar(255) DEFAULT NULL COMMENT '城市',
  `address` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '详细地址',
  `postal_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '邮编',
  `other_contract` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '其它联系方式',
  `create_date` datetime DEFAULT NULL COMMENT '创建时间',
  `create_time` datetime DEFAULT NULL COMMENT '创建日期',
  `update_date` datetime DEFAULT NULL COMMENT '更新日期',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `delete_flag` tinyint(1) DEFAULT '0' COMMENT '删标识：0-未删除；1-已删除',
  `version` int DEFAULT '1' COMMENT '版本号',
  PRIMARY KEY (`id`),
  KEY `idx_ether_address` (`ether_address`) COMMENT '以太坊地址',
  KEY `idx_user_email` (`user_email`) COMMENT '邮箱地址'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='抽奖用户信息表';