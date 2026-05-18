package com.mlinyun.usercenterbackend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mlinyun.usercenterbackend.model.entity.User;

/**
 * 用户数据访问层接口.
 *
 * <p>
 * 该接口继承自 MyBatis-Plus 的 BaseMapper 接口，提供了对用户表的基本 CRUD 操作
 * </p>
 */
public interface UserMapper extends BaseMapper<User> {

}
