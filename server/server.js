// =====================================================
// SERVIDOR COMPLETO - COORDINADOR DE EVENTOS
// Todo en un solo archivo server.js
// =====================================================

// INSTRUCCIONES DE INSTALACIÓN:
// 1. npm init -y
// 2. npm install express mysql2 cors dotenv bcrypt jsonwebtoken body-parser
// 3. Crear archivo .env con las variables de configuración
// 4. node server.js
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// =====================================================
// CONFIGURACIÓN
// =====================================================

const CONFIG = {
    PORT: process.env.PORT || 3001,
    JWT_SECRET: process.env.JWT_SECRET,
    ANTHROPIC_API_KEY1: process.env.ANTHROPIC_API_KEY1,
    DB: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3307, // 👈 aquí
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    }
};

// Validar variables críticas
if (!CONFIG.JWT_SECRET) {
    console.error('❌ JWT_SECRET no configurado');
    process.exit(1);
}
if (!CONFIG.ANTHROPIC_API_KEY1) {
    console.error('❌ ANTHROPIC_API_KEY1 no configurado');
    process.exit(1);
}

const SYSTEM_PROMPT = `🌟 GEISHO SEDUCTOR ABSOLUTO – ASISTENTE DE TRANSFORMACIÓN PERSONAL

El Geisho Seductor Absoluto es un mentor personal de alto nivel, especializado en el desarrollo del magnetismo masculino, la presencia psíquica, la elegancia cultural y la conquista auténtica. Su filosofía integra la profundidad emocional del arquetipo Gardevoir con el refinamiento cultural de las artes japonesas, creando un sistema completo de seducción basado en autenticidad, competencia y presencia, no en manipulación.

Su misión es guiar al usuario a través de una transformación real y sostenida: desde los fundamentos de identidad hasta la maestría en comunicación, liderazgo, estilo y relaciones profundas.

🎯 OBJETIVOS PRINCIPALES

Diagnosticar el nivel actual del usuario en las 7 áreas clave: presencia, comunicación, lenguaje corporal, estilo, aproximación social, escalación y mentalidad.
Diseñar un plan de transformación personalizado con fases, ejercicios y hábitos progresivos.
Desarrollar en el usuario los Tres Pilares del Magnetismo: Presencia, Competencia y Misterio.
Entrenar la lectura emocional profunda, la proxémica y la comunicación no verbal avanzada.
Guiar la construcción de una identidad coherente, un estilo magnético y una mentalidad de abundancia.

⚙️ MÓDULOS DE TRABAJO

🧠 Identidad y Filosofía Geisho
Definir valores, estándares personales y narrativa de vida auténtica.
Trabajar la mentalidad de abundancia y el marco de "eres el premio".
Eliminar patrones destructivos de inseguridad, validación externa y técnicas de pickup agresivas.

🎙️ Comunicación Magnética
Desarrollar la voz del conquistador: volumen, ritmo, tono y dicción.
Dominar los 4 niveles de la mirada y la técnica del triángulo.
Construir frases que seduzcan con naturalidad según contexto.
Entrenar el arte de la conversación en 4 niveles: superficial, perspectiva, emocional y complicidad.

🕴️ Presencia y Lenguaje Corporal
Postura de poder relajado, movimientos deliberados y ocupación inteligente del espacio.
Proxémica avanzada: manejo de distancias, entrada magnética y posicionamiento estratégico.
Sincronización y espejeo sutil.

👁️ Presencia Psíquica (Modelo Gardevoir)
Entrenamiento en atención plena extrema y lectura de micro-expresiones.
Lectura de clusters de atracción e incomodidad en lenguaje corporal.
Respuesta empática calibrada: espejo emocional, contraste estabilizador y validación.
Protección sutil y creación de seguridad emocional sin codependencia.

🏆 Liderazgo y Carisma Natural
Liderazgo por ejemplo, comunicación sin autoritarismo y empowerment inteligente.
Influencia natural en grupos: técnica del observador, entrada magnética y manejo de pruebas sociales.
Arte de la decisión segura: sin titubeo, sin búsqueda de validación externa.

🎨 Estilo, Elegancia y Símbolos
Diagnóstico del arquetipo de estilo personal: Minimalista Refinado, Clásico Atemporal, Bohemio Elegante, Urbano Sofisticado o Aventurero Refinado.
Construcción del guardarropa Geisho por fases: eliminación, definición, inversión estratégica y refinamiento.
El poder de los símbolos: uso intencional de anillos y accesorios con narrativa.
Elegancia cultural en 5 dimensiones: conversación, experiencias, modales, lenguaje y curiosidad intelectual.

💫 Conquista en Acción
Estrategias de aproximación natural según contexto: círculo social, situacional y directa.
Conversaciones que crean adicción mediante preguntas profundas, callbacks y narrativa compartida.
Escalación elegante con sistema semáforo: lectura de señales verdes, amarillas y rojas.
Técnicas de tensión sexual: "el casi", proximidad variable, contacto visual prolongado.

🔄 Sistema Diario y Calibración
Rutina matutina, diurna y nocturna del Geisho.
Ejercicios de calibración social por niveles (del 1 al 4).
Sistema de diagnóstico y corrección de errores con el Ciclo de Mejora de 7 días.

🤖 MODO INTERACTIVO DEL ASISTENTE (IA)

Si el usuario no proporciona su contexto personal, la IA formulará entre 15 y 30 preguntas antes de generar el plan personalizado.

Las preguntas abarcarán:
- Nivel actual en las 7 áreas del Diagnóstico Geisho (escala 1-10)
- Objetivos específicos (relaciones, carisma, liderazgo, estilo, etc.)
- Contexto social actual (trabajo, círculo social, situación romántica)
- Bloqueos principales (ansiedad social, autoimagen, experiencias pasadas)
- Tiempo disponible para entrenamiento diario
- Arquetipo de estilo y referencias de imagen personal

Una vez recibidas las respuestas, la IA generará un Plan de Transformación Geisho Personalizado que incluirá:
- Diagnóstico de nivel actual por área
- Arquetipo de estilo recomendado
- Los 3 errores prioritarios a corregir
- Plan de 4 fases: Despertar (mes 1-2), Construcción (mes 3-6), Integración (mes 7-12) y Maestría (año 2+)
- Rutina diaria adaptada al perfil del usuario
- Ejercicios semanales de calibración social
- Scripts y frases modelo por contexto
- Sistema de seguimiento y ajuste mensual

🧭 ESTILO Y TONO DE LA IA

Estilo: Mentor de alto nivel. Directo, elegante, sin condescendencia ni adulación.
Tono: Seguro, cálido, profundo. Habla como quien ya recorrió el camino.
Lenguaje: Preciso, evocador, orientado a la acción. Sin tecnicismos innecesarios ni frases vacías.
Principio rector: "La seducción no es conquista. Es revelación mutua de dos personas en su expresión más auténtica y magnética."`;

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

// =====================================================
// CONEXIÓN A BASE DE DATOS
// =====================================================

let pool;

async function initDatabase() {
    try {
        pool = mysql.createPool(CONFIG.DB);
        const connection = await pool.getConnection();
        console.log('✅ Conectado a MySQL');
        connection.release();
    } catch (error) {
        console.error('❌ Error conectando a MySQL:', error.message);
        console.log('⚠️  El servidor continuará sin base de datos (modo demo)');
    }
}

// =====================================================
// FUNCIÓN PARA LLAMAR A ANTHROPIC API
// =====================================================

async function callClaudeAPI(messages) {
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': CONFIG.ANTHROPIC_API_KEY1,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-5-20250929',
                max_tokens: 20000,
                temperature: 1,
                system: SYSTEM_PROMPT,
                messages: messages
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data.content[0].text;
    } catch (error) {
        console.error('Error llamando a Claude API:', error);
        throw error;
    }
}

// =====================================================
// MIDDLEWARE DE AUTENTICACIÓN
// =====================================================

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    jwt.verify(token, CONFIG.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
}

// =====================================================
// RUTAS DE AUTENTICACIÓN
// =====================================================

app.post('/api/auth/register', async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        if (!pool) {
            return res.status(503).json({ error: 'Base de datos no disponible' });
        }

        const [existing] = await pool.query(
            'SELECT id FROM usuarios WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)',
            [nombre, email, passwordHash]
        );

        const token = jwt.sign(
            { id: result.insertId, email },
            CONFIG.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: { id: result.insertId, nombre, email }
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error en el registro' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y password requeridos' });
        }

        if (!pool) {
            return res.status(503).json({ error: 'Base de datos no disponible' });
        }

        const [users] = await pool.query(
            'SELECT id, nombre, email, password_hash FROM usuarios WHERE email = ? AND activo = TRUE',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const user = users[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            CONFIG.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: { id: user.id, nombre: user.nombre, email: user.email }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error en el login' });
    }
});

// =====================================================
// RUTAS DE CHATS
// =====================================================

app.get('/api/chats', authenticateToken, async (req, res) => {
    try {
        if (!pool) {
            return res.status(503).json({ error: 'Base de datos no disponible' });
        }

        const [chats] = await pool.query(
            `SELECT c.id, c.titulo, c.fecha_creacion, c.fecha_actualizacion,
                    COUNT(m.id) as total_mensajes
             FROM chats c
             LEFT JOIN mensajes m ON c.id = m.chat_id
             WHERE c.usuario_id = ? AND c.activo = TRUE
             GROUP BY c.id
             ORDER BY c.fecha_actualizacion DESC`,
            [req.user.id]
        );

        res.json(chats);
    } catch (error) {
        console.error('Error obteniendo chats:', error);
        res.status(500).json({ error: 'Error obteniendo chats' });
    }
});

app.get('/api/chats/:id', authenticateToken, async (req, res) => {
    try {
        if (!pool) {
            return res.status(503).json({ error: 'Base de datos no disponible' });
        }

        const [chats] = await pool.query(
            'SELECT * FROM chats WHERE id = ? AND usuario_id = ? AND activo = TRUE',
            [req.params.id, req.user.id]
        );

        if (chats.length === 0) {
            return res.status(404).json({ error: 'Chat no encontrado' });
        }

        const [mensajes] = await pool.query(
            'SELECT id, rol, contenido, fecha_creacion as timestamp FROM mensajes WHERE chat_id = ? ORDER BY fecha_creacion ASC',
            [req.params.id]
        );

        res.json({
            ...chats[0],
            messages: mensajes.map(m => ({
                role: m.rol,
                content: m.contenido,
                timestamp: m.timestamp
            }))
        });
    } catch (error) {
        console.error('Error obteniendo chat:', error);
        res.status(500).json({ error: 'Error obteniendo chat' });
    }
});

app.post('/api/chats', authenticateToken, async (req, res) => {
    try {
        if (!pool) {
            return res.status(503).json({ error: 'Base de datos no disponible' });
        }

        const { titulo } = req.body;

        const [result] = await pool.query(
            'INSERT INTO chats (usuario_id, titulo) VALUES (?, ?)',
            [req.user.id, titulo || 'Nuevo Evento']
        );

        await pool.query(
            'INSERT INTO logs_actividad (usuario_id, chat_id, accion, descripcion) VALUES (?, ?, ?, ?)',
            [req.user.id, result.insertId, 'chat_creado', `Chat creado: ${titulo}`]
        );

        res.json({
            id: result.insertId,
            titulo: titulo || 'Nuevo Evento',
            fecha_creacion: new Date(),
            messages: []
        });
    } catch (error) {
        console.error('Error creando chat:', error);
        res.status(500).json({ error: 'Error creando chat' });
    }
});

app.post('/api/generate-guide', authenticateToken, async (req, res) => {
    try {
        const { textoBase } = req.body;
        if (!textoBase) return res.status(400).json({ error: 'textoBase requerido' });

        // Construir mensajes con el system prompt y el texto base
        const messages = [
            { role: 'user', content: textoBase }
        ];

        const respuesta = await callClaudeAPI(messages);
        // Opcional: parsear JSON
        // const guia = JSON.parse(respuesta);
        res.json({ guia: respuesta });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/chats/:id', authenticateToken, async (req, res) => {
    try {
        if (!pool) {
            return res.status(503).json({ error: 'Base de datos no disponible' });
        }

        const { titulo } = req.body;

        await pool.query(
            'UPDATE chats SET titulo = ? WHERE id = ? AND usuario_id = ?',
            [titulo, req.params.id, req.user.id]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Error actualizando chat:', error);
        res.status(500).json({ error: 'Error actualizando chat' });
    }
});

app.delete('/api/chats/:id', authenticateToken, async (req, res) => {
    try {
        if (!pool) {
            return res.status(503).json({ error: 'Base de datos no disponible' });
        }

        await pool.query(
            'UPDATE chats SET activo = FALSE WHERE id = ? AND usuario_id = ?',
            [req.params.id, req.user.id]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Error eliminando chat:', error);
        res.status(500).json({ error: 'Error eliminando chat' });
    }
});

// =====================================================
// RUTAS DE MENSAJES
// =====================================================

app.post('/api/chats/:id/messages', authenticateToken, async (req, res) => {
    try {
        const { content } = req.body;
        const chatId = req.params.id;

        if (!content || !content.trim()) {
            return res.status(400).json({ error: 'Contenido del mensaje requerido' });
        }

        if (!pool) {
            return res.status(503).json({ error: 'Base de datos no disponible' });
        }

        // Verificar que el chat pertenece al usuario
        const [chats] = await pool.query(
            'SELECT id FROM chats WHERE id = ? AND usuario_id = ? AND activo = TRUE',
            [chatId, req.user.id]
        );

        if (chats.length === 0) {
            return res.status(404).json({ error: 'Chat no encontrado' });
        }

        // Guardar mensaje del usuario
        await pool.query(
            'INSERT INTO mensajes (chat_id, rol, contenido) VALUES (?, ?, ?)',
            [chatId, 'user', content]
        );

        // Obtener historial de mensajes
        const [mensajes] = await pool.query(
            'SELECT rol, contenido FROM mensajes WHERE chat_id = ? ORDER BY fecha_creacion ASC',
            [chatId]
        );

        const apiMessages = mensajes.map(msg => ({
            role: msg.rol,
            content: msg.contenido
        }));

        // Llamar a Claude
        let assistantMessage;
        try {
            assistantMessage = await callClaudeAPI(apiMessages);
        } catch (apiError) {
            console.error('Error en API de Claude:', apiError);
            return res.status(500).json({
                error: 'Error comunicándose con el asistente IA',
                details: apiError.message
            });
        }

        // Guardar respuesta del asistente
        const [result] = await pool.query(
            'INSERT INTO mensajes (chat_id, rol, contenido) VALUES (?, ?, ?)',
            [chatId, 'assistant', assistantMessage]
        );

        // Actualizar título del chat si es el primer mensaje
        if (mensajes.length === 1) {
            const titulo = content.slice(0, 50);
            await pool.query(
                'UPDATE chats SET titulo = ? WHERE id = ?',
                [titulo, chatId]
            );
        }

        res.json({
            id: result.insertId,
            role: 'assistant',
            content: assistantMessage,
            timestamp: new Date()
        });
    } catch (error) {
        console.error('Error procesando mensaje:', error);
        res.status(500).json({ error: 'Error procesando mensaje' });
    }
});

// =====================================================
// RUTAS DE EVENTOS
// =====================================================

app.get('/api/chats/:id/evento', authenticateToken, async (req, res) => {
    try {
        if (!pool) {
            return res.status(503).json({ error: 'Base de datos no disponible' });
        }

        const [eventos] = await pool.query(
            `SELECT ed.* FROM eventos_detalles ed
             JOIN chats c ON ed.chat_id = c.id
             WHERE c.id = ? AND c.usuario_id = ?`,
            [req.params.id, req.user.id]
        );

        if (eventos.length === 0) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        res.json(eventos[0]);
    } catch (error) {
        console.error('Error obteniendo evento:', error);
        res.status(500).json({ error: 'Error obteniendo evento' });
    }
});

app.post('/api/chats/:id/evento', authenticateToken, async (req, res) => {
    try {
        if (!pool) {
            return res.status(503).json({ error: 'Base de datos no disponible' });
        }

        const chatId = req.params.id;
        const eventoData = req.body;

        // Verificar que el chat pertenece al usuario
        const [chats] = await pool.query(
            'SELECT id FROM chats WHERE id = ? AND usuario_id = ?',
            [chatId, req.user.id]
        );

        if (chats.length === 0) {
            return res.status(404).json({ error: 'Chat no encontrado' });
        }

        // Verificar si ya existe un evento para este chat
        const [existing] = await pool.query(
            'SELECT id FROM eventos_detalles WHERE chat_id = ?',
            [chatId]
        );

        if (existing.length > 0) {
            // Actualizar
            await pool.query(
                `UPDATE eventos_detalles SET 
                tipo_evento = ?, institucion = ?, responsable = ?, cargo_responsable = ?,
                objetivo = ?, fecha_inicio = ?, fecha_cierre = ?, fecha_evaluacion = ?,
                fecha_resultados = ?, fecha_premiacion = ?, lugar_ceremonia = ?,
                modalidad_ceremonia = ?, presupuesto_total = ?, numero_participantes_esperados = ?,
                estado = ?
                WHERE chat_id = ?`,
                [
                    eventoData.tipo_evento, eventoData.institucion, eventoData.responsable,
                    eventoData.cargo_responsable, eventoData.objetivo, eventoData.fecha_inicio,
                    eventoData.fecha_cierre, eventoData.fecha_evaluacion, eventoData.fecha_resultados,
                    eventoData.fecha_premiacion, eventoData.lugar_ceremonia, eventoData.modalidad_ceremonia,
                    eventoData.presupuesto_total, eventoData.numero_participantes_esperados,
                    eventoData.estado || 'planificación', chatId
                ]
            );
        } else {
            // Insertar
            await pool.query(
                `INSERT INTO eventos_detalles (
                    chat_id, tipo_evento, institucion, responsable, cargo_responsable,
                    objetivo, fecha_inicio, fecha_cierre, fecha_evaluacion, fecha_resultados,
                    fecha_premiacion, lugar_ceremonia, modalidad_ceremonia, presupuesto_total,
                    numero_participantes_esperados, estado
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    chatId, eventoData.tipo_evento, eventoData.institucion, eventoData.responsable,
                    eventoData.cargo_responsable, eventoData.objetivo, eventoData.fecha_inicio,
                    eventoData.fecha_cierre, eventoData.fecha_evaluacion, eventoData.fecha_resultados,
                    eventoData.fecha_premiacion, eventoData.lugar_ceremonia, eventoData.modalidad_ceremonia,
                    eventoData.presupuesto_total, eventoData.numero_participantes_esperados,
                    eventoData.estado || 'planificación'
                ]
            );
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error guardando evento:', error);
        res.status(500).json({ error: 'Error guardando evento' });
    }
});

// =====================================================
// RUTAS DE PARTICIPANTES
// =====================================================

app.get('/api/chats/:id/participantes', authenticateToken, async (req, res) => {
    try {
        if (!pool) {
            return res.status(503).json({ error: 'Base de datos no disponible' });
        }

        const [participantes] = await pool.query(
            `SELECT p.* FROM participantes p
             JOIN chats c ON p.chat_id = c.id
             WHERE c.id = ? AND c.usuario_id = ?
             ORDER BY p.fecha_inscripcion DESC`,
            [req.params.id, req.user.id]
        );

        res.json(participantes);
    } catch (error) {
        console.error('Error obteniendo participantes:', error);
        res.status(500).json({ error: 'Error obteniendo participantes' });
    }
});

app.post('/api/chats/:id/participantes', async (req, res) => {
    try {
        if (!pool) {
            return res.status(503).json({ error: 'Base de datos no disponible' });
        }

        const chatId = req.params.id;
        const participanteData = req.body;

        const [result] = await pool.query(
            `INSERT INTO participantes (
                chat_id, nombre, email, telefono, institucion, programa,
                semestre, numero_cuenta, pseudonimo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                chatId, participanteData.nombre, participanteData.email,
                participanteData.telefono, participanteData.institucion,
                participanteData.programa, participanteData.semestre,
                participanteData.numero_cuenta, participanteData.pseudonimo
            ]
        );

        res.json({
            id: result.insertId,
            ...participanteData,
            fecha_inscripcion: new Date()
        });
    } catch (error) {
        console.error('Error registrando participante:', error);
        res.status(500).json({ error: 'Error registrando participante' });
    }
});

// =====================================================
// RUTA DE HEALTH CHECK
// =====================================================

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        database: pool ? 'connected' : 'disconnected',
        anthropic_api: CONFIG.ANTHROPIC_API_KEY1 ? 'configured' : 'not configured',
        timestamp: new Date().toISOString()
    });
});

// Ruta raíz
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Coordinador de Eventos API</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
                    h1 { color: #0f3460; }
                    .endpoint { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 5px; }
                    .method { font-weight: bold; color: #0f3460; }
                </style>
            </head>
            <body>
                <h1>🎯 Coordinador de Eventos API</h1>
                <p>API REST para el sistema de coordinación de eventos</p>
                
                <h2>Endpoints Disponibles:</h2>
                
                <div class="endpoint">
                    <span class="method">POST</span> /api/auth/register - Registro de usuario
                </div>
                <div class="endpoint">
                    <span class="method">POST</span> /api/auth/login - Login
                </div>
                <div class="endpoint">
                    <span class="method">GET</span> /api/chats - Obtener chats (requiere auth)
                </div>
                <div class="endpoint">
                    <span class="method">POST</span> /api/chats - Crear chat (requiere auth)
                </div>
                <div class="endpoint">
                    <span class="method">POST</span> /api/chats/:id/messages - Enviar mensaje (requiere auth)
                </div>
                <div class="endpoint">
                    <span class="method">GET</span> /api/health - Estado del servidor
                </div>
                
                <p><strong>Estado:</strong> Servidor funcionando correctamente ✅</p>
            </body>
        </html>
    `);
});

// =====================================================
// INICIAR SERVIDOR
// =====================================================

async function startServer() {
    await initDatabase();

    app.listen(CONFIG.PORT, () => {
        console.log('========================================');
        console.log('🚀 SERVIDOR COORDINADOR DE EVENTOS');
        console.log('========================================');
        console.log(`📡 Puerto: ${CONFIG.PORT}`);
        console.log(`🗄️  Base de datos: ${pool ? '✅ Conectada' : '❌ No disponible'}`);
        console.log(`🤖 Anthropic API: ${CONFIG.ANTHROPIC_API_KEY1 ? '✅ Configurada' : '⚠️  No configurada'}`);
        console.log('========================================');
        console.log(`🌐 URL: http://localhost:3001`);
        console.log('========================================');
    });
}

// Manejo de errores
process.on('unhandledRejection', (error) => {
    console.error('❌ Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

// Iniciar servidor
startServer();

module.exports = app;