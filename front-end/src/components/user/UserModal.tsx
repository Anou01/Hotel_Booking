import React, { useState, useEffect } from "react";
import { Form, Input, Modal, Select, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { User } from "../../types/user";
import api from "../../services/api";
import { useCustomNotification } from "../../utils/notificationUtils";

const { Option } = Select;

interface UserFormProps {
  isModalVisible: boolean;
  editingUser: User | null;
  handleOk: (values: any) => void;
  handleCancel: () => void;
  form: any;
}

const UserModal: React.FC<UserFormProps> = ({
  isModalVisible,
  editingUser,
  handleOk,
  handleCancel,
  form,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null); // รีเซ็ตค่าเมื่อเปิด modal
  const [filePath, setFilePath] = useState<string | null>(null); // เก็บ filePath จาก API
  const { openNotification } = useCustomNotification();

  console.log("previewImage--->", previewImage)

  useEffect(() => {
    if (editingUser) {
      form.setFieldsValue({
        name: editingUser.name,
        username: editingUser.username,
        role: editingUser.role,
      });
      setPreviewImage(editingUser.profileImage || null);
      setFilePath(editingUser.profileImage || null);
    } else {
      form.resetFields();
      setPreviewImage(null);
      setFilePath(null);
    }
  }, [editingUser, form]);

  const handleUpload = async (file: any) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const uploadedFilePath = response.data.filePath;
      openNotification("success", {
        message: "ອັບໂຫຼດຮູບສຳເລັດ",
        description: "ຮູບພາບໄດ້ຖືກບັນທຶກແລ້ວ",
      });
      return uploadedFilePath;
    } catch (err: any) {
      openNotification("error", {
        message: "ເກີດຂໍ້ຜິດພາດໃນການອັບໂຫຼດຮູບ",
        description: err.response?.data?.message || "ກະລຸນາລອງໃໝ່ອີກຄັ้ງ",
      });
      throw err;
    }
  };

  const onFinish = (values: any) => {
    try {
      const updatedValues = { ...values, profileImage: filePath };      
      handleOk(updatedValues);
      setPreviewImage(null);
      setFilePath(null);
    } catch (err) {
      console.error("Error in form submission:", err);
    }
  };

  const uploadProps = {
    onRemove: () => {
      setPreviewImage(null);
      setFilePath(null);
    },
    beforeUpload: async (file: any) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("ກະລຸນາອັບໂຫຼດໄຟລ໌ຮູບພາດເທົ່ານັ້ນ!");
        return Upload.LIST_IGNORE;
      }

      try {
        const uploadedFilePath = await handleUpload(file);
        setPreviewImage(uploadedFilePath);
        setFilePath(uploadedFilePath);
      } catch (err:any) {
        message.error(`ບໍ່ສາມາດອັບໂຫຼດຮູບ: ${err.message || "Error unknown"}`);
      }

      return false;
    },
    // fileList,
    listType: "picture" as const, // เปลี่ยนเป็น picture-card เพื่อแสดงเฉพาะ thumbnail
    maxCount: 1,
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
      showDownloadIcon: true,
      nameRender: () => null, // ไม่แสดงชื่อไฟล์
    },
  };



  return (
    <Modal
      title={editingUser ? "ແກ້ໄຂພະນັກງານ" : "ເພີ່ມພະນັກງານ"}
      open={isModalVisible}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      okText="ບັນທຶກ"
      cancelText="ຍົກເລີກ"
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label="ຊື່" rules={[{ required: true, message: "ກະລຸนາປ້ອນຊື່!" }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="username"
          label="ຊື່ເຂົ້າລະບົບ"
          rules={[{ required: true, message: "ກະລຸນາປ້ອນຊື່ເຂົ້າລະບົບ!" }]}
        >
          <Input disabled={!!editingUser} />
        </Form.Item>
        <Form.Item
          name="password"
          label="ລະຫັດຜ່ານ"
          rules={[{ required: !editingUser, message: "ກະລຸนາປ້ອນລະຫັດຜ່ານ!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item name="role" label="ສິດນຳໃຊ້" rules={[{ required: true, message: "ກະລຸນາເລືອກສິດນຳໃຊ้!" }]}>
          <Select placeholder="ເລືອກສິດ">
            <Option value="admin">Admin</Option>
            <Option value="receptionist">Receptionist</Option>
          </Select>
        </Form.Item>
        <Form.Item label="ຮູບໂປຣໄຟລ໌">
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>ເລືອກຮູບພາບ</Button>
          </Upload>
          {previewImage && (
            <img
             src={`http://localhost:5000${previewImage}`} // ใช้ path จริงจาก API
              alt="Profile Preview"
              style={{ width: "100%", maxWidth: "200px", marginTop: 10 }}
              onError={(e) => console.error("Image failed to load:", e)} // Debug ถ้าโหลดภาพล้มเหลว
            />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;