import { useState } from 'react';
import axios from 'axios';
import InstructorRoute from '../../../component/routes/InstructorRoute';
import CourseCreateForm from '../../../component/forms/CourseCreateForm';
import Resizer from 'react-image-file-resizer';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Head from 'next/head';

const CourseCreate = () => {
  // state
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '9.99',
    uploading: false,
    paid: true,
    category: '',
    loading: false,
  });
  const [image, setImage] = useState({});
  const [preview, setPreview] = useState('');
  const [uploadButtonText, setUploadButtonText] = useState('Upload Image');

  //route
  const router = useRouter();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    setPreview(window.URL.createObjectURL(file));
    setUploadButtonText(file.name);
    setValues({ ...values, loading: true });
    // resize
    Resizer.imageFileResizer(file, 720, 500, 'JPEG', 100, 0, async (uri) => {
      try {
        let { data } = await axios.post('/api/course/upload-image', {
          image: uri,
        });
        console.log('IMAGE UPLOADED', data);
        // set image in the state
        setImage(data);
        setValues({ ...values, loading: false });
      } catch (err) {
        console.log(err);
        setValues({ ...values, loading: false });
        toast.error('Gagal Mengunggah Gambar, Coba Lagi');
      }
    });
  };

  const handleImageRemove = async () => {
    try {
      // console.log(values);
      setValues({ ...values, loading: true });
      const res = await axios.post('/api/course/remove-image', { image });
      setImage({});
      setPreview('');
      setUploadButtonText('Upload Image');
      setValues({ ...values, loading: false });
    } catch (err) {
      console.log(err);
      setValues({ ...values, loading: false });
      toast.error('Gagal Mengunggah Gambar, Coba Lagi');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/course', {
        ...values,
        image,
      });
      toast.success('Modul Berhasil di Unggah');
      router.push('/instructor');
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  return (
    <InstructorRoute>
      <Head>
            <title>Buat Pembelajaran</title>
        </Head>
      <h1 className="container-fluid p-5 bg-primary text-white text-center">Buat Pembelajaran</h1>
      <div className="pt-3 pb-3">
        <CourseCreateForm handleSubmit={handleSubmit} handleImage={handleImage} handleChange={handleChange} values={values} setValues={setValues} preview={preview} uploadButtonText={uploadButtonText} handleImageRemove={handleImageRemove} />
      </div>
    </InstructorRoute>
  );
};

export default CourseCreate;
