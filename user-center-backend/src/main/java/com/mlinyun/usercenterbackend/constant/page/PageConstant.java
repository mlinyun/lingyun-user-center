package com.mlinyun.usercenterbackend.constant.page;

/**
 * 分页常量类.
 */
public final class PageConstant {

    /**
     * 私有构造函数，防止实例化.
     */
    private PageConstant() {
        throw new IllegalStateException("Utility class");
    }

    /**
     * 当前页码最小取值.
     */
    public static final int PAGE_NUM_MIN = 1;

    /**
     * 当前页码不能为空提示信息.
     */
    public static final String PAGE_NUM_NOT_NULL_MSG = "当前页码不能为空";

    /**
     * 当前页码取值提示信息.
     */
    public static final String PAGE_NUM_RANGE_MSG = "当前页码必须大于或等于 1";

    /**
     * 每页记录数最小取值.
     */
    public static final int PAGE_SIZE_MIN = 1;

    /**
     * 每页记录数最大取值.
     */
    public static final int PAGE_SIZE_MAX = 200;

    /**
     * 每页记录数默认值.
     */
    public static final int PAGE_SIZE_DEFAULT = 10;

    /**
     * 每页记录数不能为空提示信息.
     */
    public static final String PAGE_SIZE_NOT_NULL_MSG = "每页记录数不能为空";

    /**
     * 每页记录数取值范围提示信息.
     */
    public static final String PAGE_SIZE_RANGE_MSG = "每页记录数必须在 " + PAGE_SIZE_MIN + " 到 " + PAGE_SIZE_MAX + " 之间";

    /**
     * 排序字段格式正则表达式.
     */
    public static final String SORT_FIELD_REGEX = "^[a-zA-Z0-9_]+$";

    /**
     * 排序字段格式提示信息.
     */
    public static final String SORT_FIELD_FORMAT_MSG = "排序字段只能包含字母、数字、下划线";

    /**
     * 排序方式格式正则表达式.
     */
    public static final String SORT_ORDER_REGEX = "^(?:ascend|descend)$";

    /**
     * 排序方式格式提示信息.
     */
    public static final String SORT_ORDER_FORMAT_MSG = "排序方式只能是 'ascend' 或 'descend'";

    /**
     * 升序.
     */
    public static final String ASC = "ascend";

    /**
     * 降序.
     */
    public static final String DESC = "descend";

    /**
     * 默认排序方式.
     */
    public static final String SORT_ORDER_DEFAULT = DESC;

}
