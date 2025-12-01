"use client";
import { useState, useMemo, use } from "react";
import songs from "../../../data/songs.json";
import Link from "next/link";
import {
  Button,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";

function transposeChordRoot(root, shift) {
  const sharpMap = { Db: "C#", Eb: "D#", Gb: "F#", Ab: "G#", Bb: "A#" };
  if (sharpMap[root]) root = sharpMap[root];
  const chromatic = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  const idx = chromatic.indexOf(root);
  if (idx === -1) return root; // unknown
  const newIndex = (idx + shift + chromatic.length) % chromatic.length;
  return chromatic[newIndex];
}

function transposeChordPro(chordProText, shift) {
  if (shift === 0) return chordProText;
  return chordProText.replace(
    /\[([A-G][b#]?)([^\]]*)\]/g,
    (match, root, rest) => {
      const newRoot = transposeChordRoot(root, shift);
      return `[${newRoot}${rest}]`;
    }
  );
}

export default function SongPage({ params }) {
  const { id } = use(params);
  const song = songs.find((s) => s.id === id);
  const [transpose, setTranspose] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedLyrics, setEditedLyrics] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  const toggleModal = () => {
    if (!isModalOpen) {
      setEditedLyrics(song.lyrics);
      setCopySuccess(false);
    }
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = () => {
    const message = `Song Correction Report
    
Song: ${song.title}
ID: ${song.id}

Corrected Lyrics:
${editedLyrics}

---
Original Lyrics:
${song.lyrics}`;

    navigator.clipboard.writeText(message).then(() => {
      setCopySuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setCopySuccess(false);
      }, 2000);
    });
  };

  const transposedChords = useMemo(
    () => transposeChordPro(song ? song.chords : "", transpose),
    [song, transpose]
  );
  const transposedCapo = useMemo(
    () => Math.max((song ? song.capo : 0) - transpose, 0),
    [song, transpose]
  );

  if (!song) {
    return (
      <Container className="py-4">
        <h2>Song not found</h2>
        <Link href="/" className="btn btn-secondary mt-3">
          Home
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-3 justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <h1 className="text-center fw-bold text-dark mb-3">{song.title}</h1>
          <div className="text-center text-muted mb-3">
            <div>Capo: {song.capo}</div>
            <div className="mt-1">Chords: {transposedChords}</div>
          </div>
          <div className="d-flex justify-content-center gap-2 mb-3">
            <Link href="/" className="btn btn-sm btn-dark">
              Home
            </Link>
            <Button size="sm" color="warning" onClick={toggleModal}>
              Report Error
            </Button>
            <Button
              size="sm"
              color="info"
              onClick={() => window.open(song.url, "_blank")}
            >
              Song URL
            </Button>
          </div>
          <Card>
            <CardBody>
              <pre
                className="mb-0"
                style={{ whiteSpace: "pre-wrap", fontSize: "1rem" }}
              >
                {song.lyrics}
              </pre>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal isOpen={isModalOpen} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>Report Lyrics Error</ModalHeader>
        <ModalBody>
          <p className="text-muted small mb-2">
            Edit the lyrics below to correct any errors. When you click Submit,
            the correction will be copied to your clipboard so you can send it
            to the admin.
          </p>
          <Input
            type="textarea"
            value={editedLyrics}
            onChange={(e) => setEditedLyrics(e.target.value)}
            rows={15}
            style={{ fontFamily: "monospace", fontSize: "0.9rem" }}
          />
          {copySuccess && (
            <div className="alert alert-success mt-3 mb-0">
              ✓ Copied to clipboard! Please send this to the admin.
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleSubmit}>
            Submit (Copy to Clipboard)
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
}
