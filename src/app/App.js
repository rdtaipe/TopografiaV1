import React, { useState, useRef } from 'react';
import {
    Box,
    TextField,
    Button,
    Grid,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    InputLabel,
    FormControl
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';
import html2canvas from 'html2canvas';

import NavBar from './Navbar';

const BuzonIcon = ({ color, position }) => (
    <svg width="40" height="60" viewBox="0 0 40 60" style={{ position: 'absolute', bottom: '30px', [position]: '20px' }}>
        <rect x="5" y="0" width="30" height="50" fill={color} stroke="#333" strokeWidth="2" />
        <circle cx="20" cy="55" r="5" fill="#666" />
    </svg>
);

const ExcavationCalculator = () => {
    const [config, setConfig] = useState({
        distancia: 21,
        buzonA: 2.30,
        buzonB: 1.70,
        intervalo: 3,
        pendiente: '',
        direccion: 'A'
    });

    const [mediciones, setMediciones] = useState([]);
    const [resultados, setResultados] = useState([]);
    const reportRef = useRef();

    const generarPuntos = () => {
        const puntos = [];
        const step = config.intervalo;
        const total = config.distancia;

        if (config.direccion === 'A') {
            for (let d = 0; d <= total; d += step) {
                if (d > total) d = total;
                puntos.push({ distancia: d, superficie: 0 });
            }
        } else {
            for (let d = total; d >= 0; d -= step) {
                if (d < 0) d = 0;
                puntos.push({ distancia: d, superficie: 0 });
            }
        }

        setMediciones(puntos);
    };

    const calcularExcavacion = () => {
        let pendienteBase;
        if (config.pendiente) {
            pendienteBase = parseFloat(config.pendiente) / 100;
        } else {
            pendienteBase = (config.buzonB - config.buzonA) / config.distancia;
        }

        const resultadosCalculados = mediciones.map(punto => {
            const alturaBase = config.direccion === 'A'
                ? config.buzonA + (punto.distancia * pendienteBase)
                : config.buzonB + ((config.distancia - punto.distancia) * pendienteBase);

            const profundidad = punto.superficie - alturaBase;

            return {
                ...punto,
                alturaBase: alturaBase.toFixed(3),
                profundidad: profundidad.toFixed(3),
                tipo: profundidad > 0 ? 'excavacion' : 'relleno'
            };
        });

        setResultados(resultadosCalculados);
    };

    const descargarReporte = () => {
        html2canvas(reportRef.current).then(canvas => {
            canvas.toBlob(blob => {
                const link = document.createElement('a');
                link.download = 'reporte-excavacion.png';
                link.href = URL.createObjectURL(blob);
                link.click();
            });
        });
    };

    return (
        <Box>
            <NavBar />

            <Box sx={{ p: 3 }} ref={reportRef}>
                <Paper sx={{ p: 3, mb: 3 }}>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth
                                label="Distancia Total (m)"
                                value={config.distancia}
                                onChange={e => setConfig({ ...config, distancia: e.target.value })}
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField
                                fullWidth
                                label="Altura Buzón A (m)"
                                value={config.buzonA}
                                onChange={e => setConfig({ ...config, buzonA: e.target.value })}
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField
                                fullWidth
                                label="Altura Buzón B (m)"
                                value={config.buzonB}
                                onChange={e => setConfig({ ...config, buzonB: e.target.value })}
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField
                                fullWidth
                                label="Pendiente (%)"
                                value={config.pendiente}
                                onChange={e => setConfig({ ...config, pendiente: e.target.value })}
                                type="number"
                                helperText="Opcional"
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <FormControl fullWidth>
                                <InputLabel>Dirección</InputLabel>
                                <Select
                                    value={config.direccion}
                                    onChange={e => setConfig({ ...config, direccion: e.target.value })}
                                >
                                    <MenuItem value="A">Desde Buzón A</MenuItem>
                                    <MenuItem value="B">Desde Buzón B</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" onClick={generarPuntos} fullWidth>
                                Generar Puntos de Control
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {mediciones.length > 0 && (
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <span style={{ color: '#1976d2' }}>Mediciones Topográficas</span>
                            <BuzonIcon color="#1976d2" position="left" />
                            <BuzonIcon color="#d32f2f" position="right" />
                        </Typography>

                        <Grid container spacing={3}>
                            {mediciones.map((medicion, index) => (
                                <Grid item xs={6} sm={4} key={index}>
                                    <TextField
                                        fullWidth
                                        label={`${medicion.distancia}m desde ${config.direccion === 'A' ? 'A' : 'B'}`}
                                        value={medicion.superficie}
                                        onChange={e => {
                                            const nuevasMediciones = [...mediciones];
                                            nuevasMediciones[index].superficie = parseFloat(e.target.value);
                                            setMediciones(nuevasMediciones);
                                        }}
                                        type="number"
                                        InputProps={{
                                            endAdornment: <span style={{ color: '#1976d2' }}>⏷</span>
                                        }}
                                    />
                                </Grid>
                            ))}
                            <Grid item xs={12}>
                                <Button variant="contained" color="success" onClick={calcularExcavacion} fullWidth>
                                    Calcular Perfil de Excavación
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                )}

                {resultados.length > 0 && (
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                            Resultados de la Excavación
                        </Typography>

                        <Box sx={{ height: 400, position: 'relative', mb: 3 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={resultados}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                                    <XAxis
                                        dataKey="distancia"
                                        label={{ value: 'Distancia (m)', position: 'bottom' }}
                                        tick={{ fill: '#666' }}
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        label={{ value: 'Altura (m.s.n.m)', angle: -90, position: 'left' }}
                                        tick={{ fill: '#1976d2' }}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        label={{ value: 'Profundidad (m)', angle: -90, position: 'right' }}
                                        tick={{ fill: '#4CAF50' }}
                                    />
                                    <Tooltip />

                                    {/* Superficie del terreno */}
                                    <Area
                                        yAxisId="left"
                                        dataKey="superficie"
                                        fill="#1976d2"
                                        stroke="#1976d2"
                                        name="Superficie"
                                        opacity={0.2}
                                    />

                                    {/* Base de excavación */}
                                    <Line
                                        yAxisId="left"
                                        dataKey="alturaBase"
                                        stroke="#FF9800"
                                        name="Base de Zanja"
                                        strokeWidth={2}
                                        dot={false}
                                    />

                                    {/* Profundidad de excavación */}
                                    <Line
                                        yAxisId="right"
                                        dataKey="profundidad"
                                        stroke="#4CAF50"
                                        name="Profundidad"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                    />
                                </LineChart>
                            </ResponsiveContainer>

                            <BuzonIcon color="#1976d2" position="left" />
                            <BuzonIcon color="#d32f2f" position="right" />
                        </Box>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Distancia</TableCell>
                                        <TableCell sx={{ color: '#1976d2' }}>Superficie</TableCell>
                                        <TableCell sx={{ color: '#FF9800' }}>Base Zanja</TableCell>
                                        <TableCell sx={{ color: '#4CAF50' }}>Acción Requerida</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {resultados.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.distancia}m</TableCell>
                                            <TableCell>{item.superficie}m</TableCell>
                                            <TableCell>{item.alturaBase}m</TableCell>
                                            <TableCell sx={{
                                                fontWeight: 'bold',
                                                color: item.tipo === 'excavacion' ? '#d32f2f' : '#2e7d32',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1
                                            }}>
                                                {Math.abs(item.profundidad)}m
                                                {item.tipo === 'excavacion' ? '⏷ Excavar' : '↑ Rellenar'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Button
                            variant="contained"
                            sx={{
                                mt: 3,
                                background: 'linear-gradient(45deg, #1976d2 30%, #4CAF50 90%)',
                                color: 'white'
                            }}
                            onClick={descargarReporte}
                        >
                            Exportar Reporte como Imagen
                        </Button>
                    </Paper>
                )}
            </Box>
        </Box>
    );
};

export default ExcavationCalculator;