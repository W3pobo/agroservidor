// static/js/accesibilidad.js - Sistema completo de accesibilidad con botones redondos
class LectorPantalla {
    constructor() {
        this.estaReproduciendo = false;
        this.botonesVisibles = false;
        this.inicializar();
    }

    inicializar() {
        console.log('🔄 Inicializando sistema de accesibilidad...');
        this.configurarEventos();
        this.aplicarEstilosCursor(); // <-- RE-AÑADIDO
        this.aplicarEstilosVisuales(); // Carga estilos para modos visuales
        this.agregarBotonesAccesibilidad();
        this.mejorarAccesibilidadElementos();

        // --- Cargar Preferencias Guardadas ---
        
        // 1. Tamaño de Letra
        const tamanioGuardado = localStorage.getItem('tamanioLetra');
        if (tamanioGuardado) {
            setTimeout(() => {
                const slider = document.getElementById('slider-letra');
                if(slider) slider.value = tamanioGuardado;
                this.aplicarTamanioLetra(tamanioGuardado, false); 
            }, 100); 
        }
        
        // 2. Tipografía
        const tipografiaGuardada = localStorage.getItem('tipografia');
        if (tipografiaGuardada) {
            setTimeout(() => {
                this.aplicarTipografia(tipografiaGuardada, false); 
            }, 100);
        }
        
        // 3. Tema (Modo Claro/Oscuro)
        const modoOscuroGuardado = localStorage.getItem('modoOscuro');
        if (modoOscuroGuardado === 'true') {
            document.documentElement.classList.add('modo-oscuro');
        }

        // 4. Contraste
        const contrasteGuardado = localStorage.getItem('contraste');
        if (contrasteGuardado && contrasteGuardado !== 'none') {
            document.documentElement.classList.add(`contrast-${contrasteGuardado}`);
        }

        // 5. Escala de Grises
        const grisesGuardado = localStorage.getItem('escalaGrises');
        if (grisesGuardado === 'true') {
            document.documentElement.classList.add('escala-grises');
        }
    }

    configurarEventos() {
        // Atajos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.altKey && e.key === 'l') {
                e.preventDefault();
                this.leerTextoSeleccionado();
            }
            
            if (e.ctrlKey && e.altKey && e.key === 's') {
                e.preventDefault();
                this.detenerAudio();
            }
            
            // Atajo de cursor (Ctrl+Alt+C) (RE-AÑADIDO)
            if (e.ctrlKey && e.altKey && e.key === 'c') {
                e.preventDefault();
                this.ciclarTamanioCursor();
            }
            
            // Atajo para mostrar/ocultar botones: Ctrl+Alt+A
            if (e.ctrlKey && e.altKey && e.key === 'a') {
                e.preventDefault();
                this.toggleBotones();
            }
        });

        console.log('✅ Atajos de teclado configurados');
    }

    mejorarAccesibilidadElementos() {
        const elementos = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
        elementos.forEach(el => {
            el.classList.add('mejor-focus');
            if (!el.getAttribute('aria-label')) {
                const texto = el.textContent || el.value || el.placeholder || 'Elemento interactivo';
                el.setAttribute('aria-label', texto);
            }
        });
        console.log('✅ Mejorada accesibilidad de elementos');
    }

    agregarBotonesAccesibilidad() {
        // Evitar duplicados
        if (document.getElementById('accesibilidad-toggle')) {
            console.log('⚠️ Los botones de accesibilidad ya existen');
            return;
        }

        // Botón principal
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'accesibilidad-toggle';
        toggleBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
                <path d="M12 8v4l2 2"/>
            </svg>
        `;
        toggleBtn.title = 'Accesibilidad (Ctrl+Alt+A)';
        
        // Contenedor para los botones secundarios
        const contenedor = document.createElement('div');
        contenedor.id = 'contenedor-accesibilidad';
        contenedor.style.display = 'none';
        
        // ===== INICIO DE BOTONES REORDENADOS (10 BOTONES) =====
        contenedor.innerHTML = `
            <button id="btn-leer-seleccion" class="boton-accesibilidad" title="Leer texto seleccionado (Ctrl+Alt+L)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
            </button>
            
            <button id="btn-leer-pagina" class="boton-accesibilidad" title="Leer resumen de la página">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
            </button>
            
            <button id="btn-detener-audio" class="boton-accesibilidad" title="Detener audio (Ctrl+Alt+S)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
                </svg>
            </button>
            
            <button id="btn-cursor-grande" class="boton-accesibilidad" title="Cambiar tamaño del cursor (Ctrl+Alt+C)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="3"/>
                </svg>
            </button>

            <button id="btn-tema" class="boton-accesibilidad" title="Abrir Menú de Tema">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/><path d="M12 3v1m0 16v1m8.66-12.66l-.7.7M4.04 19.96l-.7.7M21 12h-1M4 12H3m16.96-7.96l-.7.7M4.74 4.74l-.7.7"/>
                </svg>
            </button>
            
            <button id="btn-contraste" class="boton-accesibilidad" title="Abrir Menú de Contraste">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><path d="M12 18a6 6 0 0 0 0-12v12z"/>
                </svg>
            </button>
            
            <button id="btn-escala-grises" class="boton-accesibilidad" title="Activar Escala de Grises">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 0 0 20v-20z" fill="currentColor"/>
                </svg>
            </button>
            
            <button id="btn-tamanio" class="boton-accesibilidad" title="Abrir Menú de Tamaño">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>
                </svg>
            </button>
            
            <button id="btn-tipografia" class="boton-accesibilidad" title="Abrir Menú de Tipografía">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 18h16M4 22h16M6 14h12M6 10h12M10 2v8M14 2v8"/>
                </svg>
            </button>

            <button id="btn-info-accesibilidad" class="boton-accesibilidad" title="Información de accesibilidad">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
            </button>
        `;
        // ===== FIN DE BOTONES =====

        // Aplicar estilos
        this.aplicarEstilosBotones();

        document.body.appendChild(toggleBtn);
        document.body.appendChild(contenedor);

        // --- Menú de Tema ---
        const menuTema = document.createElement('div');
        menuTema.id = 'menu-tema';
        menuTema.style.display = 'none';
        menuTema.innerHTML = `
            <div class="menu-title">Seleccionar Tema</div>
            <button class="menu-option" data-tema="claro">☀️ Modo Claro</button>
            <button class="menu-option" data-tema="oscuro">🌙 Modo Oscuro (Predet.)</button>
        `;
        document.body.appendChild(menuTema);

        // --- Menú de Contraste ---
        const menuContraste = document.createElement('div');
        menuContraste.id = 'menu-contraste';
        menuContraste.style.display = 'none';
        menuContraste.innerHTML = `
            <div class="menu-title">Tipo de Contraste</div>
            <button class="menu-option" data-contrast="none">Sin Contraste</button>
            <button class="menu-option" data-contrast="high">Alto</button>
            <button class="menu-option" data-contrast="very-high">Muy Alto</button>
            <button class="menu-option" data-contrast="inverted">Invertido</button>
            <button class="menu-option" data-contrast="yellow-black">Amarillo/Negro</button>
            <button class="menu-option" data-contrast="blue-white">Azul/Blanco</button>
        `;
        document.body.appendChild(menuContraste);

        // --- Menú de Tamaño (Solo Letra) ---
        const menuTamanio = document.createElement('div');
        menuTamanio.id = 'menu-tamanio';
        menuTamanio.style.display = 'none';
        menuTamanio.innerHTML = `
            <div class="menu-title">Tamaño de Letra</div>
            <div class="menu-slider-container">
                <span style="font-size: 12px;">A</span>
                <input type="range" id="slider-letra" min="90" max="150" value="100" step="10" aria-label="Ajustar tamaño de letra">
                <span style="font-size: 18px;">A</span>
            </div>
            <button class="menu-option" data-tamanio="reset">Restablecer Letra</button>
        `;
        document.body.appendChild(menuTamanio);
        
        // --- Menú de Tipografía ---
        const menuTipografia = document.createElement('div');
        menuTipografia.id = 'menu-tipografia';
        menuTipografia.style.display = 'none';
        menuTipografia.innerHTML = `
            <div class="menu-title">Cambiar Tipografía</div>
            <button class="menu-option" data-font="default" style="font-family: Arial, sans-serif;">Predeterminada</button>
            <button class="menu-option" data-font="legible" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">Legible (Sans-Serif)</button>
            <button class="menu-option" data-font="serif" style="font-family: 'Georgia', 'Times New Roman', serif;">Serif (Con Patines)</button>
            <button class="menu-option" data-font="mono" style="font-family: 'Courier New', Courier, monospace;">Monospace</button>
        `;
        document.body.appendChild(menuTipografia);

        console.log('✅ Botones y menús de accesibilidad agregados');

        // --- Event listeners ---
        toggleBtn.addEventListener('click', () => {
            this.toggleBotones();
        });

        // Listeners Botones Principales
        document.getElementById('btn-leer-seleccion').addEventListener('click', () => { this.leerTextoSeleccionado(); this.ocultarBotones(); });
        document.getElementById('btn-leer-pagina').addEventListener('click', () => { this.leerResumenPagina(); this.ocultarBotones(); });
        document.getElementById('btn-detener-audio').addEventListener('click', () => { this.detenerAudio(); this.ocultarBotones(); });
        document.getElementById('btn-cursor-grande').addEventListener('click', () => { this.ciclarTamanioCursor(); this.ocultarBotones(); }); // <-- RE-AÑADIDO
        document.getElementById('btn-tema').addEventListener('click', () => { this.toggleMenuTema(); this.ocultarBotones(); });
        document.getElementById('btn-contraste').addEventListener('click', () => { this.toggleMenuContraste(); this.ocultarBotones(); });
        document.getElementById('btn-escala-grises').addEventListener('click', () => { this.toggleEscalaGrises(); this.ocultarBotones(); });
        document.getElementById('btn-tamanio').addEventListener('click', () => { this.toggleMenuTamanio(); this.ocultarBotones(); });
        document.getElementById('btn-tipografia').addEventListener('click', () => { this.toggleMenuTipografia(); this.ocultarBotones(); });
        document.getElementById('btn-info-accesibilidad').addEventListener('click', () => { this.mostrarInfoAccesibilidad(); this.ocultarBotones(); });

        // Listeners Menú Tema
        document.querySelectorAll('#menu-tema .menu-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const accion = btn.getAttribute('data-tema');
                if (accion === 'claro') {
                    this.toggleModoOscuro(); 
                } else if (accion === 'oscuro') {
                    this.resetModosVisuales();
                }
                this.ocultarMenuTema();
            });
        });

        // Listeners Menú Contraste
        document.querySelectorAll('#menu-contraste .menu-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const tipoContraste = btn.getAttribute('data-contrast');
                this.aplicarContraste(tipoContraste);
                this.ocultarMenuContraste();
            });
        });

        // Listeners Menú Tamaño
        document.getElementById('slider-letra').addEventListener('input', (e) => {
            this.aplicarTamanioLetra(e.target.value, true);
        });
        document.querySelector('#menu-tamanio .menu-option[data-tamanio="reset"]').addEventListener('click', () => {
            document.getElementById('slider-letra').value = 100;
            this.aplicarTamanioLetra(100, true);
        });
        
        // Listeners Menú Tipografía
        document.querySelectorAll('#menu-tipografia .menu-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const tipoFont = btn.getAttribute('data-font');
                this.aplicarTipografia(tipoFont, true);
                this.ocultarMenuTipografia();
            });
        });
    }

    aplicarEstilosBotones() {
        const estilos = `
            #accesibilidad-toggle {
                position: fixed;
                top: 80px; /* <-- MODIFICADO (antes 180px) */
                right: 25px;
                z-index: 1001;
                background-color: #4CAF50;
                border: none;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                display: flex;
                justify-content: center;
                align-items: center;
                transition: all 0.3s ease;
                color: white;
            }

            #accesibilidad-toggle:hover {
                transform: scale(1.1);
                background-color: #45a049;
            }

            #accesibilidad-toggle.active {
                background-color: #2196F3;
                transform: rotate(45deg);
            }

            #contenedor-accesibilidad {
                position: fixed;
                top: 150px; /* <-- MODIFICADO (antes 250px) */
                right: 25px;
                z-index: 1000;
                display: flex;
                flex-direction: column;
                gap: 15px;
                transition: all 0.3s ease;
            }

            .boton-accesibilidad {
                background-color: #2196F3;
                border: none;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                display: flex;
                justify-content: center;
                align-items: center;
                transition: all 0.3s ease;
                color: white;
                opacity: 0;
                transform: translateX(50px);
                animation: aparecerBoton 0.3s ease forwards;
            }

            /* Delays de animación (10 botones) */
            .boton-accesibilidad:nth-child(1) { animation-delay: 0.1s; }
            .boton-accesibilidad:nth-child(2) { animation-delay: 0.2s; }
            .boton-accesibilidad:nth-child(3) { animation-delay: 0.3s; }
            .boton-accesibilidad:nth-child(4) { animation-delay: 0.4s; } /* Cursor */
            .boton-accesibilidad:nth-child(5) { animation-delay: 0.5s; } /* Tema */
            .boton-accesibilidad:nth-child(6) { animation-delay: 0.6s; } /* Contraste */
            .boton-accesibilidad:nth-child(7) { animation-delay: 0.7s; } /* Grises */
            .boton-accesibilidad:nth-child(8) { animation-delay: 0.8s; } /* Tamaño */
            .boton-accesibilidad:nth-child(9) { animation-delay: 0.9s; } /* Tipografia */
            .boton-accesibilidad:nth-child(10) { animation-delay: 1.0s; } /* Info */

            @keyframes aparecerBoton {
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            .boton-accesibilidad:hover {
                transform: scale(1.1) !important;
                background-color: #1976D2;
            }

            .boton-accesibilidad:focus {
                outline: 3px solid #FF5722;
                outline-offset: 2px;
            }

            /* Estilos específicos */
            #btn-leer-seleccion { background-color: #4CAF50; }
            #btn-leer-seleccion:hover { background-color: #45a049; }
            #btn-leer-pagina { background-color: #FF9800; }
            #btn-leer-pagina:hover { background-color: #F57C00; }
            #btn-detener-audio { background-color: #f44336; }
            #btn-detener-audio:hover { background-color: #d32f2f; }
            #btn-info-accesibilidad { background-color: #607D8B; }
            #btn-info-accesibilidad:hover { background-color: #455A64; }

            /* Botón de Cursor (RE-AÑADIDO) */
            #btn-cursor-grande { background-color: #673AB7; } /* Deep Purple */
            #btn-cursor-grande:hover { background-color: #512DA8; }

            /* Botón de Tema */
            #btn-tema { background-color: #FFC107; } /* Amber */
            #btn-tema:hover { background-color: #FFA000; }
            
            /* Contraste */
            #btn-contraste { background-color: #000000; }
            #btn-contraste:hover { background-color: #333333; }

            /* Grises */
            #btn-escala-grises { background-color: #888888; }
            #btn-escala-grises:hover { background-color: #666666; }
            
            /* Botón de Tamaño */
            #btn-tamanio { background-color: #00BCD4; } /* Cyan */
            #btn-tamanio:hover { background-color: #0097A7; }
            
            /* Botón de Tipografía */
            #btn-tipografia { background-color: #9C27B0; } /* Purple */
            #btn-tipografia:hover { background-color: #7B1FA2; }


            /* --- Estilos para Menús Flotantes (Tema, Contraste, Tamaño, Tipografía) --- */
            #menu-tema, #menu-contraste, #menu-tamanio, #menu-tipografia {
                position: fixed;
                top: 150px; /* <-- MODIFICADO (antes 250px) */
                right: 85px; 
                width: 180px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
                z-index: 1002; 
                padding: 10px;
                display: none; 
                flex-direction: column;
                gap: 5px;
                border: 1px solid #ccc;
                animation: aparecerMenuContraste 0.2s ease forwards;
            }
            
            #menu-tamanio {
                width: 200px;
                gap: 8px;
            }
            
            #menu-tipografia {
                width: 200px;
                gap: 8px;
                background-color: rgba(255, 255, 255, 0.85);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
            }

            @keyframes aparecerMenuContraste {
                from { opacity: 0; transform: translateX(20px); }
                to { opacity: 1; transform: translateX(0); }
            }

            .menu-title {
                font-size: 14px;
                font-weight: bold;
                color: #333;
                text-align: center;
                padding-bottom: 5px;
                border-bottom: 1px solid #eee;
                margin-bottom: 5px;
            }
            
            #menu-tipografia .menu-title {
                 border-bottom: 1px solid #bbb;
            }
            
            .menu-option {
                background-color: #f0f0f0;
                color: #000;
                border: none;
                padding: 8px 12px;
                border-radius: 5px;
                cursor: pointer;
                text-align: left;
                font-size: 13px;
                transition: background-color 0.2s ease;
                font-family: Arial, sans-serif;
            }
            #menu-tamanio .menu-option, #menu-tema .menu-option, #menu-tipografia .menu-option {
                text-align: center;
            }
            .menu-option:hover {
                background-color: #e0e0e0;
            }
            .menu-option:focus {
                outline: 2px solid #005fcc;
                outline-offset: 1px;
            }
            
            /* Estilos para el Slider de Tamaño */
            .menu-slider-container {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #333;
                padding: 5px 0;
            }
            .menu-slider-container span {
                font-weight: bold;
            }
            .menu-slider-container input[type="range"] {
                flex-grow: 1;
                width: 100%;
                margin: 0;
            }
        `;

        const style = document.createElement('style');
        style.textContent = estilos;
        document.head.appendChild(style);
    }

    // --- (RE-AÑADIDO) ---
    aplicarEstilosCursor() {
        const estilos = `
            .cursor-grande * {
                cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="%234CAF50" opacity="0.8"/><circle cx="16" cy="16" r="6" fill="%234CAF50"/></svg>') 16 16, auto !important;
            }
            
            .cursor-muy-grande * {
                cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="%23FF5722" opacity="0.8"/><circle cx="24" cy="24" r="10" fill="%23FF5722"/></svg>') 24 24, auto !important;
            }
        `;

        const style = document.createElement('style');
        style.textContent = estilos;
        document.head.appendChild(style);
        console.log('✅ Estilos de cursor aplicados');
    }

    aplicarEstilosVisuales() {
        const estilos = `
            html {
                transition: filter 0.3s ease, background-color 0.3s ease, color 0.3s ease, font-size 0.2s ease;
            }
            
            /* Clases de Tipografía */
            body.font-legible, body.font-legible * { 
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important; 
            }
            body.font-serif, body.font-serif * { 
                font-family: 'Georgia', 'Times New Roman', serif !important; 
            }
            body.font-mono, body.font-mono * { 
                font-family: 'Courier New', Courier, monospace !important; 
            }
            
        
            /* Modo Claro (Invertido) */
            html.modo-oscuro {
                filter: invert(1) hue-rotate(180deg);
                background-color: #121212;
            }
            
            html.modo-oscuro img,
            html.modo-oscuro video,
            html.modo-oscuro .no-invert {
                filter: invert(1) hue-rotate(180deg);
            }
            
            /* Estilo Blur Oscuro */
            html.modo-oscuro #menu-tipografia {
                background-color: rgba(30, 30, 30, 0.85);
                border-color: #555;
            }
            html.modo-oscuro .menu-title {
                color: #ddd;
                border-bottom-color: #444;
            }
            html.modo-oscuro .menu-option {
                background-color: #555;
                color: #fff;
            }
            html.modo-oscuro .menu-option:hover {
                background-color: #777;
            }

            /* --- ESTILOS DE CONTRASTE --- */
            html.contrast-high {
                filter: contrast(200%) brightness(120%) !important;
                -webkit-filter: contrast(200%) brightness(120%) !important;
            }
            html.contrast-very-high {
                filter: contrast(300%) brightness(140%) !important;
                -webkit-filter: contrast(300%) brightness(140%) !important;
            }
            html.contrast-inverted {
                filter: invert(100%) hue-rotate(180deg) !important;
                -webkit-filter: invert(100%) hue-rotate(180deg) !important;
            }
            html.contrast-yellow-black {
                filter: sepia(100%) hue-rotate(45deg) contrast(150%) !important;
                -webkit-filter: sepia(100%) hue-rotate(45deg) contrast(150%) !important;
            }
            html.contrast-blue-white {
                filter: hue-rotate(200deg) contrast(150%) brightness(130%) !important;
                -webkit-filter: hue-rotate(200deg) contrast(150%) brightness(130%) !important;
            }
            /* --- FIN ESTILOS DE CONTRASTE --- */

            html.escala-grises {
                filter: grayscale(100%);
            }
        `;
        const style = document.createElement('style');
        style.textContent = estilos;
        document.head.appendChild(style);
        console.log('✅ Estilos visuales (oscuro, contraste, grises, fuentes) aplicados');
    }

    // --- Métodos de Menú ---
    toggleBotones() {
        if (this.botonesVisibles) {
            this.ocultarBotones();
        } else {
            this.mostrarBotones();
        }
    }

    mostrarBotones() {
        const contenedor = document.getElementById('contenedor-accesibilidad');
        const toggleBtn = document.getElementById('accesibilidad-toggle');
        
        // Ocultar todos los sub-menús al mostrar el principal
        this.ocultarMenuTema();
        this.ocultarMenuContraste();
        this.ocultarMenuTamanio();
        this.ocultarMenuTipografia();
        
        contenedor.style.display = 'flex';
        toggleBtn.classList.add('active');
        this.botonesVisibles = true;
    }

    ocultarBotones() {
        const contenedor = document.getElementById('contenedor-accesibilidad');
        const toggleBtn = document.getElementById('accesibilidad-toggle');
        
        contenedor.style.display = 'none';
        toggleBtn.classList.remove('active');
        this.botonesVisibles = false;
    }

    // --- (RE-AÑADIDO) ---
    ciclarTamanioCursor() {
        const body = document.body;
        
        if (!body.classList.contains('cursor-grande')) {
            body.classList.add('cursor-grande');
            body.classList.remove('cursor-muy-grande');
            this.mostrarMensaje('Cursor grande activado', 'success');
        } else if (!body.classList.contains('cursor-muy-grande')) {
            body.classList.add('cursor-muy-grande');
            body.classList.remove('cursor-grande');
            this.mostrarMensaje('Cursor muy grande activado', 'success');
        } else {
            body.classList.remove('cursor-grande', 'cursor-muy-grande');
            this.mostrarMensaje('Cursor normal activado', 'info');
        }
    }

    // --- Métodos de modos visuales ---
    
    toggleModoOscuro() {
        const html = document.documentElement;
        html.classList.toggle('modo-oscuro');
        
        if (html.classList.contains('modo-oscuro')) {
            this.mostrarMensaje('Modo claro activado', 'success');
            localStorage.setItem('modoOscuro', 'true'); 
        } else {
            this.mostrarMensaje('Modo oscuro (predeterminado) activado', 'info');
            localStorage.setItem('modoOscuro', 'false'); 
        }
    }

    toggleEscalaGrises() {
        const html = document.documentElement;
        html.classList.toggle('escala-grises');
        if (html.classList.contains('escala-grises')) {
            this.mostrarMensaje('Escala de grises activada', 'success');
            localStorage.setItem('escalaGrises', 'true'); 
        } else {
            this.mostrarMensaje('Escala de grises desactivada', 'info');
            localStorage.setItem('escalaGrises', 'false'); 
        }
    }

    resetModosVisuales() {
        const html = document.documentElement;
        
        const clasesVisuales = [
            'modo-oscuro', 
            'escala-grises',
            'contrast-high',
            'contrast-very-high',
            'contrast-inverted',
            'contrast-yellow-black',
            'contrast-blue-white'
        ];
        
        html.classList.remove(...clasesVisuales);
        
        html.style.backgroundColor = '';
        html.style.color = '';
        
        this.mostrarMensaje('Modo oscuro (predeterminado) restablecido', 'info');
        
        localStorage.setItem('modoOscuro', 'false');
        localStorage.setItem('escalaGrises', 'false');
        localStorage.setItem('contraste', 'none');

        this.ocultarMenuContraste();
        this.ocultarMenuTema();
    }
    
    // --- Menú Tema ---
    toggleMenuTema() {
        const menu = document.getElementById('menu-tema');
        const isVisible = menu.style.display === 'flex';
        
        if (isVisible) {
            this.ocultarMenuTema();
        } else {
            this.ocultarBotones();
            this.ocultarMenuContraste();
            this.ocultarMenuTamanio();
            this.ocultarMenuTipografia();
            menu.style.display = 'flex';
        }
    }
    ocultarMenuTema() {
        const menu = document.getElementById('menu-tema');
        if (menu) menu.style.display = 'none';
    }

    // --- Menú Contraste ---
    toggleMenuContraste() {
        const menu = document.getElementById('menu-contraste');
        const isVisible = menu.style.display === 'flex';
        
        if (isVisible) {
            this.ocultarMenuContraste();
        } else {
            this.ocultarBotones();
            this.ocultarMenuTema();
            this.ocultarMenuTamanio();
            this.ocultarMenuTipografia();
            menu.style.display = 'flex';
        }
    }
    ocultarMenuContraste() {
        const menu = document.getElementById('menu-contraste');
        if (menu) menu.style.display = 'none';
    }
    aplicarContraste(tipo) {
        const html = document.documentElement;
        const clasesContraste = ['contrast-high', 'contrast-very-high', 'contrast-inverted', 'contrast-yellow-black', 'contrast-blue-white'];
        html.classList.remove(...clasesContraste);

        let mensaje = 'Contraste normal activado';
        if (tipo !== 'none') {
            const nuevaClase = `contrast-${tipo}`;
            html.classList.add(nuevaClase);
            const nombres = { 'high': 'Contraste Alto', 'very-high': 'Contraste Muy Alto', 'inverted': 'Contraste Invertido', 'yellow-black': 'Amarillo/Negro', 'blue-white': 'Azul/Blanco' };
            mensaje = `${nombres[tipo]} activado`;
        }
        this.mostrarMensaje(mensaje, 'success');
        localStorage.setItem('contraste', tipo); 
    }
    
    // --- Menú Tamaño ---
    toggleMenuTamanio() {
        const menu = document.getElementById('menu-tamanio');
        const isVisible = menu.style.display === 'flex';
        
        if (isVisible) {
            this.ocultarMenuTamanio();
        } else {
            this.ocultarBotones();
            this.ocultarMenuTema();
            this.ocultarMenuContraste();
            this.ocultarMenuTipografia();
            menu.style.display = 'flex';
        }
    }
    ocultarMenuTamanio() {
        const menu = document.getElementById('menu-tamanio');
        if (menu) menu.style.display = 'none';
    }
    aplicarTamanioLetra(valor, mostrarMsg = true) {
        const html = document.documentElement;
        const newSize = `${valor}%`;
        html.style.fontSize = newSize;
        if (mostrarMsg) {
            this.mostrarMensaje(`Tamaño de letra: ${newSize}`, 'info');
        }
        localStorage.setItem('tamanioLetra', valor); 
    }

    // --- Menú Tipografía ---
    toggleMenuTipografia() {
        const menu = document.getElementById('menu-tipografia');
        const isVisible = menu.style.display === 'flex';
        
        if (isVisible) {
            this.ocultarMenuTipografia();
        } else {
            this.ocultarBotones();
            this.ocultarMenuTema();
            this.ocultarMenuContraste();
            this.ocultarMenuTamanio();
            menu.style.display = 'flex';
        }
    }
    ocultarMenuTipografia() {
        const menu = document.getElementById('menu-tipografia');
        if (menu) menu.style.display = 'none';
    }
    aplicarTipografia(fontName, mostrarMsg = true) {
        const body = document.body;
        const clasesFont = ['font-legible', 'font-serif', 'font-mono'];
        body.classList.remove(...clasesFont);
        
        let mensaje = 'Tipografía predeterminada';

        if (fontName !== 'default') {
            const nuevaClase = `font-${fontName}`;
            body.classList.add(nuevaClase);
            const nombres = { 'legible': 'Tipografía Legible', 'serif': 'Tipografía Serif', 'mono': 'Tipografía Monospace' };
            mensaje = `${nombres[fontName]} activada`;
        }
        
        if (mostrarMsg) {
            this.mostrarMensaje(mensaje, 'success');
        }
        localStorage.setItem('tipografia', fontName); 
    }
    
    // --- Métodos de Lector de Pantalla (Sin cambios) ---
    async leerTextoSeleccionado() {
        const texto = window.getSelection().toString().trim();
        if (texto) {
            this.mostrarMensaje('Convirtiendo texto a voz...', 'info');
            await this.convertirYReproducir(texto);
        } else {
            this.mostrarMensaje('Selecciona algún texto con el mouse para leerlo', 'info');
        }
    }

    async leerResumenPagina() {
        const titulo = document.title || 'Página sin título';
        const encabezados = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent).filter(text => text.trim().length > 0).slice(0, 3).join('. ');
        const textoPrincipal = document.querySelector('main, .content, [role="main"]') || document.body;
        const texto = textoPrincipal.innerText.replace(/\s+/g, ' ').trim().substring(0, 200) + '...';
        const resumen = `Página: ${titulo}. ${encabezados ? 'Contenido principal: ' + encabezados + '. ' : ''}Resumen: ${texto}`;
        this.mostrarMensaje('Leyendo resumen de la página...', 'info');
        await this.convertirYReproducir(resumen);
    }

    async convertirYReproducir(texto) {
        try {
            this.mostrarCargando();
            const respuesta = await fetch('/texto_a_voz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texto: texto.substring(0, 500) })
            });
            if (!respuesta.ok) throw new Error('Error en el servidor');
            const datos = await respuesta.json();
            if (datos.audio && datos.status === 'success') {
                await fetch('/reproducir_audio', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ audio: datos.audio })
                });
                this.estaReproduciendo = true;
                this.mostrarIndicadorReproduccion();
                this.mostrarMensaje('Reproduciendo audio...', 'success');
            } else {
                throw new Error(datos.error || 'Error desconocido');
            }
        } catch (error) {
            console.error('Error al convertir o reproducir audio:', error);
            this.mostrarMensaje('Error: ' + error.message, 'error');
        } finally {
            this.ocultarCargando();
        }
    }

    async detenerAudio() {
        try {
            await fetch('/detener_audio', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
            this.estaReproduciendo = false;
            this.ocultarIndicadorReproduccion();
            this.mostrarMensaje('Audio detenido', 'info');
        } catch (error) {
            console.error('Error al detener audio:', error);
            this.mostrarMensaje('Error al detener audio', 'error');
        }
    }

    // --- Métodos de UI (Sin cambios) ---
    mostrarCargando() {
        let cargando = document.getElementById('cargando-audio');
        if (!cargando) {
            cargando = document.createElement('div');
            cargando.id = 'cargando-audio';
            cargando.innerHTML = '⏳ Generando audio...';
            cargando.style.cssText = `position: fixed; top: 20px; right: 20px; background: #2196F3; color: white; padding: 10px 15px; border-radius: 5px; z-index: 10001;`;
            document.body.appendChild(cargando);
        }
    }
    ocultarCargando() {
        const cargando = document.getElementById('cargando-audio');
        if (cargando) cargando.remove();
    }
    mostrarIndicadorReproduccion() {
        let indicador = document.getElementById('indicador-reproduccion');
        if (!indicador) {
            indicador = document.createElement('div');
            indicador.id = 'indicador-reproduccion';
            indicador.innerHTML = '🔊 Reproduciendo...';
            indicador.style.cssText = `position: fixed; top: 20px; right: 20px; background: #4CAF50; color: white; padding: 12px 18px; border-radius: 8px; z-index: 10001; font-size: 14px; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.2);`;
            document.body.appendChild(indicador);
        }
    }
    ocultarIndicadorReproduccion() {
        const indicador = document.getElementById('indicador-reproduccion');
        if (indicador) indicador.remove();
    }
    mostrarMensaje(mensaje, tipo = 'info') {
        const mensajeAnterior = document.getElementById('mensaje-accesibilidad');
        if (mensajeAnterior) mensajeAnterior.remove();
        const divMensaje = document.createElement('div');
        divMensaje.id = 'mensaje-accesibilidad';
        divMensaje.textContent = mensaje;
        divMensaje.className = tipo;
        divMensaje.style.cssText = `position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #2196F3; color: white; padding: 12px 20px; border-radius: 8px; z-index: 10001; font-size: 14px; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.3); transition: all 0.3s ease;`;
        if (tipo === 'success') divMensaje.style.background = '#4CAF50';
        if (tipo === 'error') divMensaje.style.background = '#f44336';
        if (tipo === 'info') divMensaje.style.background = '#2196F3';
        document.body.appendChild(divMensaje);
        setTimeout(() => {
            if (divMensaje.parentNode) {
                divMensaje.style.opacity = '0';
                divMensaje.style.transform = 'translateX(-50%) translateY(-20px)';
                setTimeout(() => {
                    if (divMensaje.parentNode) divMensaje.remove();
                }, 300);
            }
        }, 4000);
    }

    // --- (RE-AÑADIDO) ---
    mostrarInfoAccesibilidad() {
        const info = `
🎵 LECTOR DE PANTALLA:
• Selecciona texto y haz clic en el botón 🔊 para leer
• Usa Ctrl+Alt+L para leer texto seleccionado
• Usa Ctrl+Alt+S para detener el audio

🖱️ TAMAÑO DEL CURSOR:
• Haz clic en el botón (●) para cambiar el tamaño
• Usa Ctrl+Alt+C para ciclar entre tamaños

🔡 TAMAÑO DE LETRA:
• Haz clic en el botón (T) para abrir el menú
• Mueve la barra para ajustar el tamaño de letra

🅰️ TIPOGRAFÍA:
• Haz clic en el botón (A) para cambiar la fuente

VISUAL:
• 🌓 Tema (Abre menú de Claro/Oscuro)
• 🌗 Contraste (Abre un menú de opciones)
• ⚫ Escala de Grises

♿ BOTONES DE ACCESIBILIDAD:
• Haz clic en el botón principal para mostrar/ocultar
• Usa Ctrl+Alt+A para mostrar/ocultar botones
        `;
        alert(info);
    }
}

// Inicialización automática
console.log('🚀 Cargando sistema de accesibilidad...');
window.lectorPantalla = new LectorPantalla();