import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import SketchCard from "../components/SketchCard";
import TagSelector from "../components/TagSelector";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import DefaultImage from "../default-placeholder.png";
import SubUserNav from "../components/SubUserNav";
import { serverURL } from "../serverURL";
import SpraySpinner from "../components/SprySpinner";
import { useFetch } from "../hooks/useFetch";
import { User } from "../@types/models";
import "../index.css";

interface FormDataShape {
  name: string;
  comment: string;
  url: string | File;
  battle: string;
  tags: string[];
}

const initialForm: FormDataShape = {
  name: "",
  comment: "",
  url: "",
  battle: "",
  tags: [],
};

const MySketchs = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const userId = user?._id;
  const location = useLocation();
  const navigate = useNavigate();

  const { data: activeUser, refetch } = useFetch<User>(
    userId ? `${serverURL}users/id/${userId}` : null
  );

  const [show, setShow] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>(DefaultImage);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormDataShape>(initialForm);

  const sketchsArray = activeUser?.sketchs || [];

  // When navigated here from the welcome notification, location.state
  // carries { openUpload: true }. We open the upload modal automatically
  // and clear the state so refreshing the page doesn't re-open it.
  useEffect(() => {
    const state = location.state as { openUpload?: boolean } | null;
    if (state?.openUpload) {
      setShow(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleClose = () => {
    setShow(false);
    setFormData(initialForm);
    setAvatarPreview(DefaultImage);
  };
  const handleShow = () => setShow(true);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarPreview(URL.createObjectURL(e.target.files[0]));
      setFormData({ ...formData, url: e.target.files[0] });
    }
  };

  const handleTagsChange = (tags: string[]) => {
    setFormData({ ...formData, tags });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.comment || !formData.url) {
      alert(t("mySketches.missingFields"));
      return;
    }
    if (!userId) return;

    setLoading(true);

    const myHeaders = new Headers();
    const token = localStorage.getItem("token");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("comment", formData.comment);
    submitData.append("owner", userId);
    submitData.append("url", formData.url);
    submitData.append("battle", formData.battle || "0");
    submitData.append("tags", formData.tags.join(","));

    try {
      await fetch(`${serverURL}sketches/new`, {
        method: "POST",
        headers: myHeaders,
        body: submitData,
      });
      handleClose();
      await refetch();
    } catch (error) {
      console.error(error);
      alert(t("mySketches.uploadError"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <SpraySpinner />;

  return (
    <div className="mySketch">
      <SubUserNav />
      <div>
        <div className="title">
          <Button
            title={t("mySketches.openUploadModal")}
            onClick={handleShow}
            style={{
              gap: "1em",
              fontFamily: "Mifuente2",
              fontSize: "large",
            }}
            variant="success"
          >
            <b>{t("mySketches.openUploadModal")}</b>
          </Button>

          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
            size="lg"
          >
            <Modal.Header style={{ fontSize: "small" }} closeButton>
              <Modal.Title style={{ fontSize: "medium" }}>
                {t("mySketches.uploadTitle")}
              </Modal.Title>
            </Modal.Header>

            <div>
              <div className="Avatar">
                <img
                  style={{
                    maxWidth: "20rem",
                    padding: "1rem",
                    alignSelf: "center",
                  }}
                  title={t("mySketches.selectSketch")}
                  alt="sketch"
                  src={avatarPreview}
                />
                <br />
                <input
                  title={t("mySketches.selectSketch")}
                  style={{ padding: "1rem" }}
                  type="file"
                  accept="image/jpg, image/jpeg, image/png"
                  onChange={handleFile}
                />
              </div>
              <br />

              <div className="dataform">
                <Form.Group
                  className="mb-3"
                  controlId="formBasicEmail"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                  }}
                >
                  <Form.Control
                    style={{ maxWidth: "20rem" }}
                    type="text"
                    name="name"
                    placeholder={t("mySketches.namePlaceholder")}
                    onChange={handleChange}
                  />
                  <Form.Control
                    style={{ maxWidth: "20rem" }}
                    type="text"
                    name="comment"
                    placeholder={t("mySketches.descriptionPlaceholder")}
                    onChange={handleChange}
                  />
                  <Form.Label>{t("mySketches.battlePlaceholder")}: </Form.Label>
                  <i>* {t("mySketches.battleHint")}</i>
                  <Form.Control
                    style={{ maxWidth: "10rem" }}
                    type="text"
                    name="battle"
                    placeholder="-"
                    onChange={handleChange}
                  />
                </Form.Group>

                <TagSelector
                  selected={formData.tags}
                  onChange={handleTagsChange}
                />
              </div>

              <Modal.Footer>
                <Button
                  title={t("mySketches.cancel")}
                  variant="danger"
                  onClick={handleClose}
                >
                  {t("mySketches.close")}
                </Button>
                <Button
                  title={t("mySketches.uploadTooltip")}
                  style={{ cursor: "pointer" }}
                  onClick={handleSubmit}
                  variant="success"
                >
                  {t("mySketches.upload")}
                </Button>
              </Modal.Footer>
            </div>
          </Modal>
        </div>

        <div className="cardcontainer">
          {sketchsArray.map((sketch) => (
            <SketchCard key={sketch._id} props={sketch} onUpdate={refetch} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MySketchs;
