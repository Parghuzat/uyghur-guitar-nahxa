"use client";
import { useState, useMemo, use } from "react";
import songs from "../../../data/songs.json";
import Link from "next/link";
import { Button, Container, Row, Col, Card, CardBody } from "reactstrap";

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
    </Container>
  );
}
