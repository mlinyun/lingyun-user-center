package com.mlinyun.usercenterbackend.model.converter;

import com.mlinyun.usercenterbackend.constant.user.UserRoleEnum;
import com.mlinyun.usercenterbackend.model.dto.admin.AdminAddUserRequest;
import com.mlinyun.usercenterbackend.model.dto.admin.AdminUpdateUserInfoRequest;
import com.mlinyun.usercenterbackend.model.dto.user.UserUpdateInfoRequest;
import com.mlinyun.usercenterbackend.model.entity.User;
import com.mlinyun.usercenterbackend.model.vo.user.UserLoginVo;
import com.mlinyun.usercenterbackend.model.vo.user.UserVo;
import java.util.List;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

/**
 * 用户模型转换器.
 *
 * <p>
 * componentModel = SPRING：生成的实现类自动注册为 Spring Bean，可直接 @Autowired注入使用，unmappedTargetPolicy =
 * IGNORE：忽略未映射的目标属性，避免编译时警告，适用于部分字段不需要映射的情况
 * </p>
 */
@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserConverter {

    // region Entity → VO 映射
    /**
     * 将用户实体转换为登录用户视图对象（脱敏）.
     *
     * @param user {@linkplain User 用户实体}
     * @return {@linkplain UserLoginVo 登录用户视图对象}
     */
    UserLoginVo toUserLoginVo(User user);

    /**
     * 将用户实体转换为用户视图对象（脱敏）.
     *
     * @param user {@linkplain User 用户实体}
     * @return {@linkplain UserVo 用户视图对象}
     */
    UserVo toUserVo(User user);

    /**
     * 将用户实体列表批量转换为用户视图对象列表.
     *
     * @param userList 用户实体列表
     * @return 用户视图对象列表
     */
    List<UserVo> toUserVoList(List<User> userList);
    // endregion

    // region DTO → Entity 映射（用户端）
    /**
     * 将用户更新信息请求体的非空字段合并到已有的用户实体中.
     *
     * <p>
     * 使用 {@code NullValuePropertyMappingStrategy.IGNORE} 策略： 当 DTO 中的字段为 null 时，不会覆盖目标实体中的原有值
     * </p>
     *
     * @param userUpdateInfoRequest {@linkplain UserUpdateInfoRequest 用户更新信息请求体}
     * @param user {@linkplain User 待更新的用户实体}
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateUserFromRequest(UserUpdateInfoRequest userUpdateInfoRequest, @MappingTarget User user);
    // endregion

    // region DTO → Entity 映射（管理员端）
    /**
     * 将管理员添加用户请求体转换为用户实体.
     *
     * <p>
     * 使用 {@code NullValuePropertyMappingStrategy.IGNORE} 策略， 忽略请求体中为 null 的可选字段，避免覆盖实体默认值。 {@code userPassword} 和
     * {@code checkPassword} 为业务校验字段，不参与实体映射。
     * </p>
     *
     * @param request {@linkplain AdminAddUserRequest 管理员添加用户请求体}
     * @return {@linkplain User 用户实体}
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "userPassword", ignore = true)
    @Mapping(target = "userRole", source = "userRole", qualifiedByName = "stringToUserRole")
    User toUserFromAdminAdd(AdminAddUserRequest request);

    /**
     * 将管理员更新用户信息请求体的非空字段合并到已有的用户实体中.
     *
     * @param request {@linkplain AdminUpdateUserInfoRequest 管理员更新用户信息请求体}
     * @param user {@linkplain User 待更新的用户实体}
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "userRole", source = "userRole", qualifiedByName = "stringToUserRole")
    void updateUserFromAdminRequest(AdminUpdateUserInfoRequest request, @MappingTarget User user);
    // endregion

    // region 自定义类型转换
    /**
     * 将角色字符串值转换为 {@link UserRoleEnum} 枚举.
     *
     * <p>
     * 用于处理 {@code AdminAddUserRequest} 和 {@code AdminUpdateUserInfoRequest} 中 {@code userRole} 字段（String 类型）到
     * {@code User} 实体中 {@code userRole} 字段（UserRoleEnum 类型）的映射。
     * </p>
     *
     * @param value 角色字符串值（如 "user"、"admin"）
     * @return 对应的 {@link UserRoleEnum} 枚举值，如果输入为 null 则返回 null
     */
    @Named("stringToUserRole")
    default UserRoleEnum stringToUserRole(String value) {
        if (value == null) {
            return null;
        }
        return UserRoleEnum.getRoleEnumByValue(value);
    }
    // endregion

}
