import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Image } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";
import { serverURL } from "../serverURL";
import SubUserNav from "./SubUserNav";
import DeleteAccountButton from "./DeleteAccountButton";
import "../index.css";

interface UpdateFormData {
  email: string;
  password: string;
  username: string;
  info: string;
  avatar: string | File;
}

const initialForm: UpdateFormData = {
  email: "",
  password: "",
  username: "",
  info: "",
  avatar: "",
};

const EditProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    user?.avatar
  );
  const [formData, setFormData] = useState<UpdateFormData>(initialForm);
  const [saving, setSaving] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarPreview(URL.createObjectURL(e.target.files[0]));
      setFormData({ ...formData, avatar: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?._id) return;

    const myHeaders = new Headers();
    const token = localStorage.getItem("token");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const submitData = new FormData();
    if (formData.email) submitData.append("email", formData.email);
    if (formData.username) submitData.append("username", formData.username);
    if (formData.password) submitData.append("password", formData.password);
    if (formData.info) submitData.append("info", formData.info);
    if (formData.avatar instanceof File) {
      submitData.append("avatar", formData.avatar);
    }

    setSaving(true);
    try {
      const response = await fetch(`${serverURL}users/update/${user._id}`, {
        method: "POST",
        headers: myHeaders,
        body: submitData,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        alert(body.error || t("profile.updateError"));
        return;
      }

      navigate("/mysketchs");
    } catch (error) {
      console.error("Update profile failed:", error);
      alert(t("profile.updateError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <SubUserNav />
      <div className="editprofile-container">
        <div className="editProfile__avatar">
          <Image
            alt="User Avatar"
            src={avatarPreview || user?.avatar}
            roundedCircle
          />
          <Form.Control
            type="file"
            accept="image/jpg, image/jpeg, image/png"
            onChange={handleFile}
          />
        </div>

        <Form className="editProfile__form" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>{t("profile.emailLabel")}</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder={user?.email}
              onChange={handleChange}
            />
            <Form.Text className="text-muted">
              <i>{t("profile.required")}</i>
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>{t("profile.usernameLabel")}</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder={user?.username}
              onChange={handleChange}
            />
            <Form.Text className="text-muted">
              <i>{t("profile.required")}</i>
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicInfo">
            <Form.Label>{t("profile.infoLabel")}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="info"
              placeholder={user?.info}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="editProfile__actions">
            <Button
              variant="dark"
              type="button"
              onClick={() => navigate("/mysketchs")}
              disabled={saving}
            >
              {t("profile.cancel")}
            </Button>
            <Button variant="success" type="submit" disabled={saving}>
              {saving ? "..." : t("profile.save")}
            </Button>
          </div>
        </Form>

        {/* Moved INSIDE the dark container so it inherits the dark background
            instead of sitting on the white page underneath. */}
        <DeleteAccountButton />
      </div>
    </>
  );
};

export default EditProfile;
