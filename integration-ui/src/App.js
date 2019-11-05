import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';

import api from './integration-api';

function App() {
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('RUB');
  const [rate, setRate] = useState();
  const [url, setUrl] = useState();
  const [name, setName] = useState('');
  const [pluginFile, setPluginFile] = useState();
  const [pluginList, setPluginList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPluginName, setSelectedPluginName] = useState('');

  async function updatePluginList() {
    setIsLoading(true);
    const plugins = await api.listPlugins();
    setPluginList(plugins);
    if (plugins.length > 0) {
      setSelectedPluginName(plugins[0].name);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    updatePluginList();
  }, []);

  async function runCommand() {
    setIsLoading(true);
    const result = await api.command({ from, to, plugin: selectedPluginName });
    setRate(result.rate);
    setUrl(result.url);
    setIsLoading(false);
  }

  async function uploadPlugin() {
    try {
      await api.uploadPlugin(name, pluginFile);
      await updatePluginList();
    } catch (err) {
      console.error('error uploading plugin', err);
    }
  }

  const urlExtension = url
    ? url
        .split('.')
        .pop()
        .toLowerCase()
    : '';

  return (
    <Container>
      <Row>
        <h2>Exchange rates & animals</h2>
      </Row>
      <Form>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Name</Form.Label>
            <Form.Control placeholder="plugin name" value={name} onChange={e => setName(e.target.value)} />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>File</Form.Label>
            <Form.Control type="file" onChange={e => setPluginFile(e.target.files[0])} />
          </Form.Group>
        </Form.Row>
        <Button onClick={uploadPlugin}>Upload</Button>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>From</Form.Label>
            <Form.Control placeholder="source currency" value={from} onChange={e => setFrom(e.target.value)} />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>To</Form.Label>
            <Form.Control placeholder="destination currency" value={to} onChange={e => setTo(e.target.value)} />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Plugin</Form.Label>
            <Form.Control as="select" onChange={e => setSelectedPluginName(e.target.value)}>
              {pluginList.map((option, index) => {
                return (
                  <option key={index} value={option.name}>
                    {option.name}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>
        </Form.Row>
        {isLoading ? <Spinner animation="border" /> : <Button onClick={runCommand}>Run</Button>}
      </Form>
      {rate && url ? (
        <Row>
          <Col>
            <Card style={{ width: '100%' }}>
              <Card.Body>
                {urlExtension === 'mp4' || urlExtension === 'webm' ? (
                  <video autoPlay loop muted style={{ 'max-height': '80vh', 'max-width': '80vh' }}>
                    <source src={url} type={`video/${urlExtension}`} />
                  </video>
                ) : (
                  <img src={url} style={{ 'max-height': '80vh', 'max-width': '80vh' }} />
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card style={{ width: '100%' }}>
              <Card.Body>
                <Card.Title>
                  {from} > {to}
                </Card.Title>
                <Card.Text>
                  <Badge>{rate}</Badge>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : null}
    </Container>
  );
}

export default App;
