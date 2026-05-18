package com.mlinyun.usercenterbackend.manager;

import cn.hutool.core.io.FileUtil;
import com.mlinyun.usercenterbackend.config.CosClientConfig;
import com.qcloud.cos.COSClient;
import com.qcloud.cos.model.COSObject;
import com.qcloud.cos.model.GetObjectRequest;
import com.qcloud.cos.model.PutObjectRequest;
import com.qcloud.cos.model.PutObjectResult;
import com.qcloud.cos.model.ciModel.persistence.PicOperations;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 对象存储服务管理器.
 *
 * <p>
 * 提供对象存储服务的基本操作，如上传、下载等
 * </p>
 */
@Component
public class CosManager {

    /**
     * 腾讯云 COS 客户端配置类.
     */
    private final CosClientConfig cosClientConfig;

    /**
     * 腾讯云 COS 客户端实例.
     */
    private final COSClient cosClient;

    /**
     * 缩略图尺寸（256x256）.
     */
    private static final int THUMBNAIL_SIZE = 256;

    /**
     * 生成缩略图的最小文件大小（2KB）.
     */
    private static final int MINIMUM_THUMBNAIL_FILE_SIZE = 2 * 1024;

    /**
     * 构造函数，注入 COS 客户端配置并初始化 COS 客户端.
     *
     * @param cosClientConfig COS 客户端配置类实例
     * @param cosClient COS 客户端实例
     */
    @Autowired
    public CosManager(CosClientConfig cosClientConfig, COSClient cosClient) {
        this.cosClientConfig = cosClientConfig;
        this.cosClient = cosClient;
    }

    /**
     * 上传对象.
     *
     * @param key 唯一键
     * @param file 文件
     * @return PutObjectResult 对象，包含文件上传的结果信息，如 ETag 等
     */
    public PutObjectResult putObject(String key, File file) {
        // 创建 PutObjectRequest 对象，指定存储桶名称、对象键和文件
        PutObjectRequest putObjectRequest = new PutObjectRequest(cosClientConfig.getBucket(), key, file);
        return cosClient.putObject(putObjectRequest);
    }

    /**
     * 上传对象（附带图片信息）.
     *
     * @param key 唯一键
     * @param file 文件
     * @return PutObjectResult 对象，包含文件上传的结果信息，如 ETag 等
     */
    public PutObjectResult putPictureObject(String key, File file) {
        // 对图片进行处理（获取基本信息也被视作为一种处理）
        PicOperations picOperations = new PicOperations();
        // 是否返回原图信息，0不返回原图信息，1 返回原图信息，默认为 0
        picOperations.setIsPicInfo(1);
        // 构造图片处理规则
        // 1. 图片压缩（将图片转换成 webp 格式）规则
        String webpKey = FileUtil.mainName(key) + ".webp";
        PicOperations.Rule compressRule = new PicOperations.Rule();
        compressRule.setFileId(webpKey);
        compressRule.setBucket(cosClientConfig.getBucket());
        compressRule.setRule("imageMogr2/format/webp");
        // 2. 缩略图处理规则
        PicOperations.Rule thumbnailRule = new PicOperations.Rule();
        // 拼接缩略图路径
        String thumbnailKey = FileUtil.mainName(key) + "_thumbnail." + FileUtil.getSuffix(key);
        thumbnailRule.setFileId(thumbnailKey);
        thumbnailRule.setBucket(cosClientConfig.getBucket());
        thumbnailRule.setRule(String.format("imageMogr2/thumbnail/%sx%s>", THUMBNAIL_SIZE, THUMBNAIL_SIZE));
        // 图片处理规则列表，用于存储图片处理规则
        List<PicOperations.Rule> rulesList = new ArrayList<>();
        // 添加图片压缩规则
        rulesList.add(compressRule);
        // 添加缩略图处理规则，仅对大于 20 KB 的图片生成缩略图
        if (file.length() > MINIMUM_THUMBNAIL_FILE_SIZE) {
            rulesList.add(thumbnailRule);
        }
        // 构造处理参数
        PutObjectRequest putObjectRequest = new PutObjectRequest(cosClientConfig.getBucket(), key, file);
        // 设置图片处理规则
        picOperations.setRules(rulesList);
        putObjectRequest.setPicOperations(picOperations);
        return cosClient.putObject(putObjectRequest);
    }

    /**
     * 下载对象.
     *
     * @param key 唯一键
     * @return COSObject 对象，包含下载的文件内容和元数据
     */
    public COSObject getObject(String key) {
        GetObjectRequest getObjectRequest = new GetObjectRequest(cosClientConfig.getBucket(), key);
        return cosClient.getObject(getObjectRequest);
    }

    /**
     * 删除对象.
     *
     * @param key 唯一键
     */
    public void deleteObject(String key) {
        cosClient.deleteObject(cosClientConfig.getBucket(), key);
    }

}
