package com.mlinyun.usercenterbackend.constant.table;

/**
 * 通用字段常量.
 */
public final class BaseFields {

    /**
     * 私有构造函数，防止实例化.
     */
    private BaseFields() {
        throw new IllegalStateException("Utility class");
    }

    /**
     * 主键 ID 字段名.
     */
    public static final String ID = "id";

    /**
     * 主键 ID 不能为空提示信息.
     */
    public static final String ID_NOT_NULL_MSG = "主键 ID 不能为空";

    /**
     * 主键 ID 不能小于 0 提示信息.
     */
    public static final String ID_INVALID_MSG = "主键 ID 不合法";

    /**
     * 编辑时间字段名.
     */
    public static final String EDIT_TIME = "editTime";

    /**
     * 创建时间字段名.
     */
    public static final String CREATE_TIME = "createTime";

    /**
     * 更新时间字段名.
     */
    public static final String UPDATE_TIME = "updateTime";

    /**
     * 逻辑删除字段名.
     */
    public static final String IS_DELETE = "isDelete";

}
