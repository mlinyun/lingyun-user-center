package com.mlinyun.usercenterbackend.constant.user;

/**
 * 用户常量类.
 *
 * <p>
 * 用于存放用户相关的常量
 * </p>
 */
public final class UserConstant {

    /**
     * 私有构造函数，防止实例化.
     */
    private UserConstant() {
        throw new IllegalStateException("Utility class");
    }

    // =============== 登录注册相关常量 ===============
    /**
     * 用户登录态键.
     */
    public static final String USER_LOGIN_STATE = "user_login_state";

    // region 登录账号
    /**
     * 账号最小长度.
     */
    public static final int ACCOUNT_MIN = 4;

    /**
     * 账号最大长度.
     */
    public static final int ACCOUNT_MAX = 32;

    /**
     * 账号格式正则表达式（包含长度限制）.
     */
    public static final String ACCOUNT_REGEX = "^[a-zA-Z0-9@._]{" + ACCOUNT_MIN + "," + ACCOUNT_MAX + "}$";

    /**
     * 账号不能为空提示信息.
     */
    public static final String ACCOUNT_NOT_NULL_MSG = "账号不能为空";

    /**
     * 账号长度范围提示信息.
     */
    public static final String ACCOUNT_LENGTH_MSG = "账号长度必须在" + ACCOUNT_MIN + "-" + ACCOUNT_MAX + "位之间";

    /**
     * 账号格式要求提示信息.
     */
    public static final String ACCOUNT_FORMAT_MSG = "登录账号只能包含字母、数字和下划线";

    /**
     * 账号被禁用提示信息.
     */
    public static final String ACCOUNT_BANNED_MSG = "账号已被禁用，请联系管理员";

    /**
     * 账号未登录提示信息.
     */
    public static final String ACCOUNT_NOT_LOGIN_MSG = "用户未登录，请先登录";

    /**
     * 账号已存在提示信息.
     */
    public static final String ACCOUNT_EXIST_MSG = "登录账号已存在，请重新输入";

    /**
     * 账号不存在提示信息.
     */
    public static final String ACCOUNT_NOT_EXIST_MSG = "用户不存在或密码错误，请检查输入";
    // endregion

    // region 登录密码
    /**
     * 密码最小长度.
     */
    public static final int PWD_MIN = 8;

    /**
     * 密码最大长度.
     */
    public static final int PWD_MAX = 20;

    /**
     * 密码默认长度.
     */
    public static final int PWD_DEFAULT = 16;

    /**
     * 密码格式正则表达式（包含长度限制）.
     */
    public static final String PWD_REGEX =
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)" + "(?=.*[~`!@#$%^&*()\\-_=+\\[{\\]}\\\\|;:'\",<.>/?])"
                    + "[A-Za-z\\d~`!@#$%^&*()\\-_=+\\[{\\]}\\\\|;:'\",<.>/?]{" + PWD_MIN + "," + PWD_MAX + "}$";

    /**
     * 密码不能为空提示信息.
     */
    public static final String PWD_NOT_NULL_MSG = "密码不能为空";

    /**
     * 密码长度范围提示信息.
     */
    public static final String PWD_LENGTH_MSG = "密码长度必须在" + PWD_MIN + "-" + PWD_MAX + "位之间";

    /**
     * 密码格式要求提示信息.
     */
    public static final String PWD_FORMAT_MSG = "登录密码必须包含大写字母、小写字母、数字和特殊字符";

    /**
     * 密码不一致提示信息.
     */
    public static final String PWD_NOT_MATCH_MSG = "两次输入的密码不一致";
    // endregion

    // region 用户昵称
    /**
     * 用户昵称最小长度.
     */
    public static final int NICKNAME_MIN = 2;

    /**
     * 用户昵称最大长度.
     */
    public static final int NICKNAME_MAX = 20;

    /**
     * 用户昵称长度提示信息.
     */
    public static final String NICKNAME_LENGTH_MSG = "用户昵称长度必须在" + NICKNAME_MIN + "-" + NICKNAME_MAX + "个字符之间";
    // endregion

    // region 用户头像
    /**
     * 用户默认头像 URL.
     */
    public static final String AVATAR_DEFAULT_URL = "https://static.mlinyun.com/user-center/avatar/default/avatar.png";

    /**
     * 头像上传路径.
     */
    public static final String AVATAR_UPLOAD_PATH = "/user-center/avatar";

    /**
     * 用户头像格式提示信息.
     */
    public static final String AVATAR_FORMAT_MSG = "用户头像必须是一个有效的 URL 地址";

    /**
     * 用户头像上传允许的最大文件大小（2MB）.
     */
    public static final long AVATAR_MAX_FILE_SIZE = 2L * 1024 * 1024;

    /**
     * 用户头像上传允许的文件扩展名.
     */
    public static final String[] AVATAR_ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp", "gif"};

    /**
     * 用户头像文件不能为空提示信息.
     */
    public static final String AVATAR_FILE_EMPTY_MSG = "头像文件不能为空";

    /**
     * 用户头像文件过大提示信息.
     */
    public static final String AVATAR_FILE_TOO_LARGE_MSG = "头像文件过大，不能超过 5MB";

    /**
     * 用户头像文件类型不支持提示信息.
     */
    public static final String AVATAR_FILE_TYPE_INVALID_MSG = "头像文件格式不支持，仅支持 jpg/jpeg/png/webp/gif";

    /**
     * 用户头像上传失败提示信息.
     */
    public static final String AVATAR_UPLOAD_FAILED_MSG = "头像上传失败，请稍后再试";
    // endregion

    // region 用户简介
    /**
     * 用户简介最大长度.
     */
    public static final int PROFILE_MAX = 200;

    /**
     * 用户简介默认值.
     */
    public static final String PROFILE_DEFAULT = "这个人很懒，什么都没有留下~";

    /**
     * 用户简介长度提示信息.
     */
    public static final String PROFILE_LENGTH_MSG = "用户简介长度不能超过" + PROFILE_MAX + "个字符";
    // endregion

    // region 用户角色
    /**
     * 管理员角色.
     */
    public static final String ROLE_ADMIN = "admin";

    /**
     * 用户角色正则表达式.
     */
    public static final String ROLE_REGEX = "^(?:user|admin)$";

    /**
     * 用户角色取值提示信息.
     */
    public static final String ROLE_VALUE_MSG = "用户角色只能是'user'（普通用户）或'admin'（管理员）";
    // endregion

    // region 性别
    /**
     * 用户性别最小取值.
     */
    public static final int GENDER_MIN = 0;

    /**
     * 用户性别最大取值.
     */
    public static final int GENDER_MAX = 2;

    /**
     * 用户性别取值范围提示信息.
     */
    public static final String GENDER_RANGE_MSG = "用户性别只能为0（女）、1（男）或2（未知）";
    // endregion

    // region 手机号
    /**
     * 手机号格式正则表达式.
     */
    public static final String PHONE_REGEX =
            "^(?:\\+?86)?1(?:3\\d{3}|5[^4\\D]\\d{2}|8\\d{3}|7(?:[0-35-9]\\d{2}|4(?:0\\d|1[0-2]|9\\d))|"
                    + "9[0-35-9]\\d{2}|6[2567]\\d{2}|4(?:(?:10|4[01])\\d{3}|[68]\\d{4}|[579]\\d{2}))\\d{6}$";

    /**
     * 手机号格式提示信息.
     */
    public static final String PHONE_FORMAT_MSG = "手机号格式不正确，请输入有效的手机号";

    /**
     * 手机号不能为空提示信息.
     */
    public static final String PHONE_NOT_NULL_MSG = "手机号不能为空";

    /**
     * 手机号被注册提示信息.
     */
    public static final String PHONE_EXIST_MSG = "该手机号已被注册，请重新输入";

    /**
     * 手机号未注册提示信息.
     */
    public static final String PHONE_NOT_EXIST_MSG = "该手机号未注册，请检查输入或注册新账号";

    /**
     * 手机号相同提示信息.
     */
    public static final String PHONE_SAME_MSG = "新手机号与当前手机号相同，请重新输入";

    /**
     * 手机号未绑定任何账号提示信息.
     */
    public static final String PHONE_NOT_BOUND_MSG = "该手机号未绑定任何账号，请检查输入或注册新账号";
    // endregion

    // region 邮箱
    /**
     * 邮箱不能为空提示信息.
     */
    public static final String EMAIL_NOT_NULL_MSG = "邮箱不能为空";

    /**
     * 邮箱格式提示信息.
     */
    public static final String EMAIL_FORMAT_MSG = "邮箱格式不正确，请输入有效的邮箱地址";

    /**
     * 邮箱被注册提示信息.
     */
    public static final String EMAIL_EXIST_MSG = "该邮箱已被注册，请重新输入";

    /**
     * 邮箱未注册提示信息.
     */
    public static final String EMAIL_NOT_EXIST_MSG = "该邮箱未注册，请检查输入或注册新账号";

    /**
     * 邮箱未绑定任何账号提示信息.
     */
    public static final String EMAIL_NOT_BOUND_MSG = "该邮箱未绑定任何账号，请检查输入或注册新账号";

    /**
     * 邮箱相同提示信息.
     */
    public static final String EMAIL_SAME_MSG = "新邮箱与当前邮箱相同，请重新输入";
    // endregion

    // region 状态
    /**
     * 用户状态最小取值.
     */
    public static final int STATUS_MIN = 0;

    /**
     * 用户状态最大取值.
     */
    public static final int STATUS_MAX = 1;

    /**
     * 用户状态取值范围提示信息.
     */
    public static final String STATUS_RANGE_MSG = "用户状态只能为0（正常）或1（禁用）";
    // endregion

    /**
     * 用户注册失败提示信息.
     */
    public static final String REGISTER_FAILED_MSG = "用户注册失败，请稍后再试";

    /**
     * 密码重置失败提示信息.
     */
    public static final String RESET_PWD_FAILED_MSG = "密码重置失败，请稍后再试";

    /**
     * 登录用户不能为空提示信息.
     */
    public static final String LOGIN_USER_NOT_NULL = "登录用户不能为空";

}
