declare namespace API {
  type AdminAddUserRequest = {
    /** 登录账号 */
    userAccount: string;
    /** 登录密码 */
    userPassword: string;
    /** 校验密码 */
    checkPassword: string;
    /** 用户昵称 */
    userName?: string;
    /** 用户头像 */
    userAvatar?: string;
    /** 用户简介 */
    userProfile?: string;
    /** 用户角色 */
    userRole?: "user" | "admin";
    /** 性别（0女 1男 2未知） */
    userGender?: 0 | 1 | 2;
    /** 手机号 */
    userPhone?: string;
    /** 邮箱地址 */
    userEmail?: string;
  };

  type AdminBanUserRequest = {
    /** 用户主键 ID，使用雪花算法生成 */
    id: number;
    /** 状态（0正常 1封禁） */
    userStatus?: 0 | 1;
  };

  type AdminQueryUserRequest = {
    /** 当前页码 */
    pageNum: number;
    /** 每页记录数 */
    pageSize: number;
    /** 排序字段 */
    sortField?: string;
    /** 排序方式 */
    sortOrder?: "ascend" | "descend";
    /** 用户主键 ID，使用雪花算法生成 */
    id?: number;
    /** 登录账号 */
    userAccount?: string;
    /** 用户昵称 */
    userName?: string;
    /** 用户简介 */
    userProfile?: string;
    /** 用户角色 */
    userRole?: "user" | "admin";
    /** 性别（0女 1男 2未知） */
    userGender?: 0 | 1 | 2;
    /** 手机号 */
    userPhone?: string;
    /** 邮箱地址 */
    userEmail?: string;
    /** 状态（0正常 1封禁） */
    userStatus?: 0 | 1;
    /** 创建起始时间 */
    createTimeStart?: string;
    /** 创建结束时间 */
    createTimeEnd?: string;
  };

  type AdminResetUserPwdRequest = {
    /** 用户主键 ID，使用雪花算法生成 */
    id: number;
    /** 新的密码 */
    newPassword: string;
  };

  type AdminUpdateUserInfoRequest = {
    /** 用户主键 ID，使用雪花算法生成 */
    id: number;
    /** 用户昵称 */
    userName?: string;
    /** 用户头像 */
    userAvatar?: string;
    /** 用户简介 */
    userProfile?: string;
    /** 用户角色 */
    userRole?: "user" | "admin";
  };

  type adminUploadAvatarParams = {
    userId: number;
  };

  type BaseResponseBoolean = {
    /** 请求是否成功 */
    success: true | false;
    /** 状态码 */
    code: number;
    /** 响应消息 */
    message: string;
    data?: boolean;
  };

  type BaseResponsePageUserVo = {
    /** 请求是否成功 */
    success: true | false;
    /** 状态码 */
    code: number;
    /** 响应消息 */
    message: string;
    data?: PageUserVo;
  };

  type BaseResponseString = {
    /** 请求是否成功 */
    success: true | false;
    /** 状态码 */
    code: number;
    /** 响应消息 */
    message: string;
    data?: string;
  };

  type BaseResponseUserLoginVo = {
    /** 请求是否成功 */
    success: true | false;
    /** 状态码 */
    code: number;
    /** 响应消息 */
    message: string;
    data?: UserLoginVo;
  };

  type BaseResponseUserVo = {
    /** 请求是否成功 */
    success: true | false;
    /** 状态码 */
    code: number;
    /** 响应消息 */
    message: string;
    data?: UserVo;
  };

  type GetOrDeleteRequest = {
    /** 主键 ID */
    id: number;
  };

  type OrderItem = {
    column?: string;
    asc?: boolean;
  };

  type PageUserVo = {
    records?: UserVo[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageUserVo;
    searchCount?: PageUserVo;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type SendCaptchaRequest = {
    /** 验证码类型 */
    type: "EMAIL" | "SMS";
    /** 验证码场景 */
    scene: "REGISTER" | "LOGIN" | "RESET_PWD" | "BIND_CHANGE";
    /** 发送目标（邮箱或手机号） */
    target: string;
  };

  type UserBindEmailRequest = {
    /** 邮箱地址 */
    userEmail: string;
    /** 邮箱验证码 */
    captchaCode: string;
  };

  type UserBindPhoneRequest = {
    /** 手机号码 */
    userPhone: string;
    /** 短信验证码 */
    captchaCode: string;
  };

  type UserEmailLoginRequest = {
    /** 邮箱地址 */
    userEmail: string;
    /** 邮箱验证码 */
    captchaCode: string;
  };

  type UserEmailRegisterRequest = {
    /** 邮箱地址 */
    userEmail: string;
    /** 邮箱验证码 */
    captchaCode: string;
    /** 登录密码 */
    userPassword: string;
    /** 校验密码 */
    checkPassword: string;
  };

  type UserEmailResetPwdRequest = {
    /** 用户邮箱 */
    userEmail: string;
    /** 邮箱验证码 */
    captchaCode: string;
    /** 新的密码 */
    newPassword: string;
    /** 校验密码 */
    checkPassword: string;
  };

  type UserLoginRequest = {
    /** 登录账号 */
    userAccount: string;
    /** 登录密码 */
    userPassword: string;
  };

  type UserLoginVo = {
    /** 用户主键ID，使用雪花算法生成 */
    id?: number;
    /** 登录账号，必须唯一 */
    userAccount?: string;
    /** 用户昵称 */
    userName?: string;
    /** 用户头像 URL */
    userAvatar?: string;
    /** 用户简介 */
    userProfile?: string;
    /** 用户角色 */
    userRole?: "user" | "admin";
    /** 性别（0女 1男 2未知） */
    userGender?: 0 | 1 | 2;
    /** 手机号 */
    userPhone?: string;
    /** 手机号是否已验证（0未验证 1已验证） */
    phoneVerified?: 0 | 1;
    /** 邮箱地址 */
    userEmail?: string;
    /** 邮箱是否已验证（0未验证 1已验证） */
    emailVerified?: 0 | 1;
    /** 状态（0正常 1封禁） */
    userStatus?: 0 | 1;
    /** 创建时间 */
    createTime?: string;
  };

  type UserPhoneLoginRequest = {
    /** 手机号码 */
    userPhone: string;
    /** 短信验证码 */
    captchaCode: string;
  };

  type UserPhoneRegisterRequest = {
    /** 手机号码 */
    userPhone: string;
    /** 短信验证码 */
    captchaCode: string;
    /** 登录密码 */
    userPassword: string;
    /** 确认密码 */
    checkPassword: string;
  };

  type UserPhoneResetPwdRequest = {
    /** 手机号码 */
    userPhone: string;
    /** 短信验证码 */
    captchaCode: string;
    /** 新的密码 */
    newPassword: string;
    /** 校验密码 */
    checkPassword: string;
  };

  type UserRegisterRequest = {
    /** 登录账号 */
    userAccount: string;
    /** 登录密码 */
    userPassword: string;
    /** 校验密码 */
    checkPassword: string;
  };

  type UserUpdateInfoRequest = {
    /** 用户主键 ID，使用雪花算法生成 */
    id: number;
    /** 用户昵称 */
    userName?: string;
    /** 用户头像 */
    userAvatar?: string;
    /** 用户简介 */
    userProfile?: string;
    /** 性别（0女 1男 2未知） */
    userGender?: 0 | 1 | 2;
  };

  type UserUpdatePwdRequest = {
    /** 用户主键 ID，使用雪花算法生成 */
    id: number;
    /** 原始密码 */
    rawPassword: string;
    /** 新的密码 */
    newPassword: string;
    /** 校验密码 */
    checkPassword: string;
  };

  type UserVo = {
    /** 用户主键ID，使用雪花算法生成 */
    id?: number;
    /** 登录账号，必须唯一 */
    userAccount?: string;
    /** 用户昵称 */
    userName?: string;
    /** 用户头像 URL */
    userAvatar?: string;
    /** 用户简介 */
    userProfile?: string;
    /** 用户角色 */
    userRole?: "user" | "admin";
    /** 性别（0女 1男 2未知） */
    userGender?: 0 | 1 | 2;
    /** 手机号 */
    userPhone?: string;
    /** 手机号是否已验证（0未验证 1已验证） */
    phoneVerified?: 0 | 1;
    /** 邮箱地址 */
    userEmail?: string;
    /** 邮箱是否已验证（0未验证 1已验证） */
    emailVerified?: 0 | 1;
    /** 状态（0正常 1封禁） */
    userStatus?: 0 | 1;
    /** 编辑时间 */
    editTime?: string;
    /** 创建时间 */
    createTime?: string;
    /** 更新时间 */
    updateTime?: string;
  };
}
