import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  Image as ImageIcon,
  X,
  Sparkles,
  Video,
  Download,
  RotateCcw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileVideo,
  Pencil,
} from 'lucide-react';
import { analyzeImage, generateWalkthroughVideo } from '../services/gemini';
import styles from './GeneratorPage.module.css';

const STEPS = {
  UPLOAD: 'upload',
  PROMPT: 'prompt',
  GENERATING: 'generating',
  RESULT: 'result',
};

export default function GeneratorPage() {
  const [step, setStep] = useState(STEPS.UPLOAD);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const [error, setError] = useState('');

  // Dropzone
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024, // 20MB
  });

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setPrompt('');
    setError('');
  };

  // Step 1 → 2: Analyze image
  const handleAnalyze = async () => {
    if (!imageFile) return;
    setIsAnalyzing(true);
    setError('');
    try {
      const generatedPrompt = await analyzeImage(imageFile);
      setPrompt(generatedPrompt);
      setStep(STEPS.PROMPT);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to analyze image. Please check your API key and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Step 2 → 3 → 4: Generate video
  const handleGenerate = async () => {
    setStep(STEPS.GENERATING);
    setError('');
    setProgressMsg('Starting...');
    try {
      const result = await generateWalkthroughVideo(imageFile, prompt, (msg) => {
        setProgressMsg(msg);
      });
      setVideoUrl(result.videoUrl);
      setVideoBlob(result.videoBlob);
      setStep(STEPS.RESULT);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Video generation failed. Please try again.');
      setStep(STEPS.PROMPT);
    }
  };

  // Download video
  const handleDownload = () => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `walkthrough-${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Reset everything
  const handleReset = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setStep(STEPS.UPLOAD);
    setImageFile(null);
    setImagePreview(null);
    setPrompt('');
    setProgressMsg('');
    setVideoUrl(null);
    setVideoBlob(null);
    setError('');
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Progress Indicator */}
        <div className={styles.progressBar}>
          {['Upload', 'Prompt', 'Generate', 'Result'].map((label, idx) => {
            const stepKeys = [STEPS.UPLOAD, STEPS.PROMPT, STEPS.GENERATING, STEPS.RESULT];
            const currentIdx = stepKeys.indexOf(step);
            const isActive = idx <= currentIdx;
            return (
              <div key={label} className={styles.progressStep}>
                <div className={`${styles.progressDot} ${isActive ? styles.progressDotActive : ''}`}>
                  {idx < currentIdx ? <CheckCircle2 size={16} /> : (idx + 1)}
                </div>
                <span className={`${styles.progressLabel} ${isActive ? styles.progressLabelActive : ''}`}>
                  {label}
                </span>
                {idx < 3 && (
                  <div className={`${styles.progressLine} ${idx < currentIdx ? styles.progressLineActive : ''}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Error Banner */}
        {error && (
          <div className={styles.errorBanner}>
            <AlertCircle size={18} />
            <span>{error}</span>
            <button onClick={() => setError('')} className={styles.errorClose}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* ---------- STEP: UPLOAD ---------- */}
        {step === STEPS.UPLOAD && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h1>Upload Property Image</h1>
              <p>Upload a photo of the property you want to create a walkthrough for</p>
            </div>

            {!imagePreview ? (
              <div
                {...getRootProps()}
                className={`${styles.dropzone} ${isDragActive ? styles.dropzoneActive : ''}`}
              >
                <input {...getInputProps()} />
                <div className={styles.dropzoneContent}>
                  <div className={styles.dropzoneIcon}>
                    <Upload size={32} />
                  </div>
                  <h3>Drag & drop your property image</h3>
                  <p>or click to browse files</p>
                  <span className={styles.dropzoneFormats}>
                    Supports JPG, PNG, WebP — up to 20MB
                  </span>
                </div>
              </div>
            ) : (
              <div className={styles.previewCard}>
                <div className={styles.previewImageWrap}>
                  <img src={imagePreview} alt="Property preview" className={styles.previewImage} />
                  <button onClick={clearImage} className={styles.removeImageBtn}>
                    <X size={18} />
                  </button>
                </div>
                <div className={styles.previewInfo}>
                  <div className={styles.previewMeta}>
                    <ImageIcon size={18} />
                    <div>
                      <p className={styles.previewName}>{imageFile.name}</p>
                      <p className={styles.previewSize}>{(imageFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className={styles.analyzeBtn}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 size={18} className={styles.spinner} />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        <span>Analyze & Generate Prompt</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------- STEP: PROMPT ---------- */}
        {step === STEPS.PROMPT && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h1>Review Walkthrough Prompt</h1>
              <p>AI has analyzed your image and created a cinematic walkthrough description. Edit if needed.</p>
            </div>

            <div className={styles.promptLayout}>
              <div className={styles.promptImageSide}>
                <img src={imagePreview} alt="Property" className={styles.promptImage} />
              </div>

              <div className={styles.promptEditorSide}>
                <div className={styles.promptEditorHeader}>
                  <Pencil size={16} />
                  <span>Walkthrough Prompt</span>
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className={styles.promptTextarea}
                  rows={10}
                />
                <div className={styles.promptActions}>
                  <button onClick={() => setStep(STEPS.UPLOAD)} className={styles.secondaryBtn}>
                    <RotateCcw size={16} />
                    <span>Back</span>
                  </button>
                  <button onClick={handleGenerate} className={styles.generateBtn}>
                    <Video size={18} />
                    <span>Generate Walkthrough Video</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------- STEP: GENERATING ---------- */}
        {step === STEPS.GENERATING && (
          <div className={styles.section}>
            <div className={styles.generatingCard}>
              <div className={styles.generatingSpinner}>
                <div className={styles.spinnerRing} />
                <FileVideo size={32} className={styles.spinnerIcon} />
              </div>
              <h2>Generating Your Walkthrough</h2>
              <p className={styles.generatingMsg}>{progressMsg}</p>
              <div className={styles.generatingHint}>
                <Sparkles size={14} />
                <span>This typically takes 2-5 minutes. Please keep this tab open.</span>
              </div>
            </div>
          </div>
        )}

        {/* ---------- STEP: RESULT ---------- */}
        {step === STEPS.RESULT && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h1>Your Walkthrough is Ready!</h1>
              <p>Preview and download your AI-generated virtual property walkthrough</p>
            </div>

            <div className={styles.resultCard}>
              <div className={styles.videoWrapper}>
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className={styles.videoPlayer}
                />
              </div>
              <div className={styles.resultActions}>
                <button onClick={handleDownload} className={styles.downloadBtn}>
                  <Download size={18} />
                  <span>Download Video</span>
                </button>
                <button onClick={handleReset} className={styles.secondaryBtn}>
                  <RotateCcw size={16} />
                  <span>Generate Another</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
