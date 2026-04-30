// ==================== DATOS DE JUGADORES Y SUSTITUTOS ====================
    const jugadoresRaw = [
        "gabiota30,98.1M", "Jay Dennise,120.8M", "enoc2,118.6M", "Dasstas,110.2M", "eqqui7,106.8M",
        "Kandi1619,103.1M", "bobafitness,100.5M", "AugustoAlonzo,99.6M", "BrebisGaleuse,95.5M", "Alaroña19,89.9M",
        "Jos rv,81.0M", "Berenice3,103.2M", "RVU81,106.8M", "Bozoow,107.5M", "Celso Leao,115.0M",
        "Rick TW,145.0M", "Mylinh84,69.8M", "Wendler Gilson,72.8M", "hardiness,73.5M", "whitebeardX,76.2M",
        "Dayane Prado,80.0M", "GaspoCABJ,81.1M", "Barone 1,81.1M", "Asap Owen,82.5M", "oFantasma,82.5M",
        "IIProdigyII,85.8M", "Diano Xau,87.1M", "Igor123ja,87.5M", "Mayaneitor3000,88.3M", "Andres Ec,91.6M",
        "Coquita de vidrio,92.6M", "Doom74,93.4M", "wismerhill51,95.2M", "KahScalzer,96.5M", "melaisa,51.8M",
        "Zurdoll,63.5M", "Omegazero86,64.6M", "Screamdemi,69.1M", "Flash Martins 1,69.7M", "oshynfood,70.7M",
        "Milkya1,70.7M", "Gara333,73.9M", "Rikko13,82.4M", "WilliamRod,82.6M", "blizter03,85.8M",
        "OsvaldRJ,85.9M", "HalyssonG,86.3M", "johnny9555,86.7M", "Zabelier,94.5M", "Geraldo Peixoto,47.5M",
        "JoMps,61.1M", "Suda0312,62.3M", "theking1129,62.8M", "Thenry Henry,63.1M", "Daemmonn,64.1M",
        "obed117,66.4M", "Homer Squad,68.2M", "Cax3,70.7M", "David9319,72.8M", "Seawhite,83.2M",
        "Hal9mil,87.4M", "Harlequimm,88.2M", "Evg3nia,88.3M", "dogeviper999,92.6M", "kone33,45.1M",
        "peñarol 1989,52.1M", "TepssGames,54.7M", "NandoGomez,58.3M", "Vartz,58.9M", "Crowell Smart,59.6M",
        "Mar Almaraz,60.6M", "cordoba3389,60.8M", "Deoxys07,62.4M", "Carmela Soprano,62.9M", "Davidmdo,63.4M",
        "cicario33,75.7M", "CarLos1998,78.5M", "Odet3,38.3M", "foureagle32,63.1M", "Verooh,64.9M"
    ];

    let jugadores = [];

    function cargarJugadores() {
        const guardado = localStorage.getItem("tormenta_jugadores");
        if (guardado) {
            jugadores = JSON.parse(guardado);
        } else {
            jugadores = jugadoresRaw.map(j => {
                let [nombre, poder] = j.split(',');
                return { nombre: nombre.trim(), poder: poder, estado: "Activo" };
            });
            guardarJugadores();
        }
    }

    function guardarJugadores() {
        localStorage.setItem("tormenta_jugadores", JSON.stringify(jugadores));
    }

    // Array vacío para sustitutos (usuario los asignará después)
    let sustitutos = [];

    // ==================== ESTRUCTURAS (AJUSTA POSICIONES AQUÍ) ====================
    // Cada estructura ahora tiene: namesTop y namesLeft para posicionar los cuadros de nombres
    // Usa porcentajes relativos al contenedor del mapa
    const estructuras = [
        { id: "info_center", nombre: "CI1", top: "19%", left: "35%", namesTop: "10%", namesLeft: "25%" },
        { id: "nuclear_silo", nombre: "Silo", top: "47%", left: "52%", namesTop: "50%", namesLeft: "63%" },
        { id: "arsenal", nombre: "C1", top: "22%", left: "51%", namesTop: "9%", namesLeft: "57%" },
        { id: "mercenary", nombre: "C2", top: "73%", left: "50%", namesTop: "90%", namesLeft: "52%" },
        { id: "oil1", nombre: "Oil R1", top: "35%", left: "22%", namesTop: "35%", namesLeft: "10%" },
        { id: "oil2", nombre: "Oil R2", top: "62%", left: "80%", namesTop: "61%", namesLeft: "92%" },
        { id: "science_hub", nombre: "CI2", top: "76%", left: "71%", namesTop: "85%", namesLeft: "81%" },
        { id: "hospital1", nombre: "H1", top: "61%", left: "22%", namesTop: "65%", namesLeft: "10%" },
        { id: "hospital2", nombre: "H2", top: "33%", left: "81%", namesTop: "20%", namesLeft: "90%" },
        { id: "hospital3", nombre: "H3", top: "76%", left: "30%", namesTop: "88%", namesLeft: "20%" },
        { id: "hospital4", nombre: "H4", top: "21%", left: "69%", namesTop: "8%", namesLeft: "75%" }
    ];

    let asignaciones = {};
    let asignacionesSustitutos = {};

    function cargarAsignaciones() {
        const guardado = localStorage.getItem("tormenta_asignaciones");
        if (guardado) {
            asignaciones = JSON.parse(guardado);
        } else {
            estructuras.forEach(e => { asignaciones[e.id] = []; });
        }

        const guardadoSustitutos = localStorage.getItem("tormenta_asignaciones_sustitutos");
        if (guardadoSustitutos) {
            asignacionesSustitutos = JSON.parse(guardadoSustitutos);
        } else {
            asignacionesSustitutos = { sustitutos: [] };
        }
    }

    function guardarAsignaciones() {
        localStorage.setItem("tormenta_asignaciones", JSON.stringify(asignaciones));
        localStorage.setItem("tormenta_asignaciones_sustitutos", JSON.stringify(asignacionesSustitutos));
    }

    function renderizarMapa() {
        const overlay = document.getElementById("structuresOverlay");
        const svgOverlay = document.getElementById("linesOverlay");
        const mapContainer = document.getElementById("mapContainer");
        
        overlay.innerHTML = "";
        svgOverlay.innerHTML = "";
        
        // Obtener dimensiones del contenedor para calcular píxeles desde porcentajes
        const containerWidth = mapContainer.offsetWidth;
        const containerHeight = mapContainer.offsetHeight;
        
        estructuras.forEach(est => {
            // Crear estructura (círculo amarillo)
            const btn = document.createElement("div");
            btn.className = "structure";
            btn.style.top = est.top;
            btn.style.left = est.left;
            btn.style.transform = "translate(-50%, -50%)";
            btn.textContent = est.nombre.split(' ').slice(0,2).join('\n');
            btn.onclick = () => abrirModal(est.id, est.nombre);
            overlay.appendChild(btn);
            
            const asignados = asignaciones[est.id] || [];
            if (asignados.length > 0) {
                // Crear cuadro de nombres EN LA POSICIÓN ESPECIFICADA
                const namesDiv = document.createElement("div");
                namesDiv.className = "assigned-names";
                namesDiv.style.top = est.namesTop;
                namesDiv.style.left = est.namesLeft;
                namesDiv.style.transform = "translate(-50%, -50%)";
                
                // Mostrar nombres en formato de lista vertical (máximo 5 nombres)
                const nombresVisibles = asignados.slice(0, 5);
                const totalNombres = asignados.length;
                
                nombresVisibles.forEach(nombre => {
                    const nombreSpan = document.createElement("span");
                    nombreSpan.textContent = nombre;
                    nombreSpan.style.fontSize = "inherit";
                    nombreSpan.style.wordBreak = "break-word";
                    nombreSpan.style.overflowWrap = "break-word";
                    nombreSpan.title = nombre;
                    namesDiv.appendChild(nombreSpan);
                });
                
                if (totalNombres > 5) {
                    const masSpan = document.createElement("span");
                    masSpan.textContent = `+${totalNombres - 5} más`;
                    masSpan.style.fontSize = "8px";
                    masSpan.style.color = "#ffaa44";
                    masSpan.style.fontStyle = "italic";
                    namesDiv.appendChild(masSpan);
                }
                
                overlay.appendChild(namesDiv);
                
                // Dibujar línea conectora
                const structX = (parseFloat(est.left) / 100) * containerWidth;
                const structY = (parseFloat(est.top) / 100) * containerHeight;
                
                const namesX = (parseFloat(est.namesLeft) / 100) * containerWidth;
                const namesY = (parseFloat(est.namesTop) / 100) * containerHeight;
                
                // Crear línea SVG
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", structX);
                line.setAttribute("y1", structY);
                line.setAttribute("x2", namesX);
                line.setAttribute("y2", namesY);
                line.setAttribute("stroke", "#ff0000");
                line.setAttribute("stroke-width", "2");
                line.setAttribute("opacity", "0.85");
                line.setAttribute("stroke-dasharray", "5,5");
                
                svgOverlay.appendChild(line);
            }
        });
        
        // Ajustar dimensiones del SVG después de agregarlo
        svgOverlay.setAttribute("width", "100%");
        svgOverlay.setAttribute("height", "100%");
        svgOverlay.style.position = "absolute";
        svgOverlay.style.top = "0";
        svgOverlay.style.left = "0";
    }

    let modalEstructuraActual = null;
    let modalJugadoresFiltrados = [];
    
    function abrirModal(estructuraId, nombreEstructura) {
        modalEstructuraActual = estructuraId;
        document.getElementById("modalTitle").innerHTML = `📌 ${nombreEstructura}`;
        document.getElementById("modalSearch").value = "";
        
        const asignadosActuales = new Set(asignaciones[estructuraId] || []);
        const filter = document.getElementById("filterStatus").value;
        let jugadoresFiltrados = jugadores;
        if (filter === "Activo") {
            jugadoresFiltrados = jugadores.filter(j => j.estado === "Activo");
        }
        
        modalJugadoresFiltrados = jugadoresFiltrados;
        renderizarModalJugadores(asignadosActuales);
        
        document.getElementById("modal").style.display = "flex";
    }
    
    function renderizarModalJugadores(asignadosActuales) {
        const search = document.getElementById("modalSearch").value.toLowerCase();
        let jugadoresMostrados = modalJugadoresFiltrados;
        
        if (search) {
            jugadoresMostrados = jugadoresMostrados.filter(j => j.nombre.toLowerCase().includes(search));
        }
        
        const container = document.getElementById("modalPlayersList");
        container.innerHTML = "";
        
        jugadoresMostrados.forEach(j => {
            const div = document.createElement("div");
            div.className = "modal-player";
            const cb = document.createElement("input");
            cb.type = "checkbox";
            cb.checked = asignadosActuales.has(j.nombre);
            cb.onchange = (e) => {
                if (e.target.checked) {
                    if (!asignaciones[modalEstructuraActual].includes(j.nombre)) {
                        asignaciones[modalEstructuraActual].push(j.nombre);
                    }
                } else {
                    asignaciones[modalEstructuraActual] = asignaciones[modalEstructuraActual].filter(n => n !== j.nombre);
                }
                guardarAsignaciones();
                renderizarMapa();
            };
            const span = document.createElement("span");
            span.innerHTML = `<strong>${j.nombre}</strong> <span style="color:#ffaa44; margin-left:8px;">⚡${j.poder}</span>`;
            div.appendChild(cb);
            div.appendChild(span);
            container.appendChild(div);
        });
    }
    
    async function exportarImagen() {
        const mapContainer = document.querySelector(".map-wrapper");
        const sustitutos = asignacionesSustitutos.sustitutos || [];
        
        // Crear tabla de sustitutos temporalmente
        const tempTable = document.createElement("div");
        tempTable.id = "temp-export-table";
        tempTable.style.cssText = `
            background: transparent;
            padding: 8px 0;
            margin-top: 8px;
            border-radius: 0;
            border: none;
        `;
        
        let tableHTML = `
            <div style="color: #ffdd99; text-align: center; margin-bottom: 6px; font-size: 0.9rem; font-weight: 700;">🔄 SUSTITUTOS</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3px; color: #eef2ff; font-size: 0.7rem;">
        `;
        
        if (sustitutos.length === 0) {
            tableHTML += `<div style="grid-column: 1/-1; text-align: center; color: #999; font-size: 0.65rem;">Sin sustitutos asignados</div>`;
        } else {
            sustitutos.forEach(s => {
                tableHTML += `<div style="padding: 2px 4px; font-size: 0.7rem;">${s.nombre}</div>`;
            });
        }
        
        tableHTML += `</div>`;
        tempTable.innerHTML = tableHTML;
        mapContainer.appendChild(tempTable);
        
        let oldScrollY = window.scrollY;
        let oldScrollX = window.scrollX;
        let oldScale = 1;
        let oldPan = {x:0, y:0};
        
        try {
            window.scrollTo(0, 0); // Workaround para bug de html2canvas con scroll
        
        if(window.pz) {
            oldScale = window.pz.getScale();
            oldPan = window.pz.getPan();
            
            // Remover el event listener antes de destruir
            const parent = document.getElementById("mapContainer").parentElement;
            parent.removeEventListener('wheel', window.pz.zoomWithWheel);
            
            window.pz.destroy();
            window.pz = null;
            document.getElementById("mapContainer").removeAttribute('style');
            
            await new Promise(r => setTimeout(r, 150)); // Esperar a que el DOM se repinte
        }
        
        const canvas = await html2canvas(mapContainer, {
                scale: 2,
                backgroundColor: "#0b0e16",
                logging: false,
                useCORS: true,
                scrollX: 0,
                scrollY: 0
            });
            const link = document.createElement("a");
            link.download = "tormenta_asignaciones.png";
            link.href = canvas.toDataURL();
            link.click();
            mostrarToast("📸 Imagen exportada con éxito");
        } catch (err) {
            console.error(err);
            mostrarToast("❌ Error al exportar");
        } finally {
            // Remover tabla temporal
            tempTable.remove();
            // Restaurar Panzoom
            if(!window.pz) {
                const mapContainerEl = document.getElementById("mapContainer");
                window.pz = Panzoom(mapContainerEl, {
                    maxScale: 3,
                    minScale: 1,
                    contain: 'outside'
                });
                mapContainerEl.parentElement.addEventListener('wheel', window.pz.zoomWithWheel);
                
                window.pz.pan(oldPan.x, oldPan.y, { animate: false });
                window.pz.zoom(oldScale, { animate: false });
            }
            window.scrollTo(oldScrollX, oldScrollY);
        }
    }
    
    function mostrarToast(msg) {
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }
    
    function resetearAsignaciones() {
        estructuras.forEach(e => { asignaciones[e.id] = []; });
        asignacionesSustitutos.sustitutos = [];
        guardarAsignaciones();
        renderizarMapa();
        actualizarListaSustitutos();
        mostrarToast("🗑️ Todas las asignaciones fueron reiniciadas");
    }
    
    function mostrarSidebar() {
        const windowWidth = window.innerWidth;
        if (windowWidth > 1024) {
            // Desktop: ambos sidebars visibles
            document.getElementById("sidebarTitulares").classList.add("open");
            document.getElementById("sidebarSustitutos").classList.add("open");
        } else {
            // Mobile/Tablet: mostrar tab de titulares
            mostrarTab('titulares');
        }
        actualizarListaJugadores();
    }
    
    function actualizarListaJugadores() {
        const search = document.getElementById("playerSearch").value.toLowerCase();
        const filter = document.getElementById("filterStatus").value;
        let jugadoresFiltrados = jugadores;
        if (filter === "Activo") {
            jugadoresFiltrados = jugadores.filter(j => j.estado === "Activo");
        }
        if (search) {
            jugadoresFiltrados = jugadoresFiltrados.filter(j => j.nombre.toLowerCase().includes(search));
        }
        
        const container = document.getElementById("playerList");
        container.innerHTML = jugadoresFiltrados.map(j => `
            <div class="player-card">
                <div class="player-info">
                    <span class="player-name">${j.nombre}</span>
                    <span class="player-power">${j.poder}</span>
                </div>
                <button class="btn btn-danger" style="padding: 4px 8px; font-size: 0.7rem; border-radius: 8px;" onclick="eliminarJugador('${j.nombre.replace(/'/g, "\\'")}')" title="Eliminar jugador">✕</button>
            </div>
        `).join("");
    }

    function actualizarListaSustitutos() {
        // Sección de agregar sustitutos (búsqueda de jugadores disponibles)
        const searchAdd = document.getElementById("addSubstitutesSearch").value.toLowerCase();
        const sustitutosActuales = asignacionesSustitutos.sustitutos || [];
        
        // Filtrar jugadores que NO sean sustitutos ya asignados
        let jugadoresDisponibles = jugadores.filter(j => 
            !sustitutosActuales.some(s => s.nombre === j.nombre)
        );
        
        if (searchAdd) {
            jugadoresDisponibles = jugadoresDisponibles.filter(j => 
                j.nombre.toLowerCase().includes(searchAdd)
            );
        }
        
        const containerAdd = document.getElementById("addSubstitutesList");
        if (jugadoresDisponibles.length === 0) {
            containerAdd.innerHTML = `<div style="text-align: center; padding: 10px; color: #999; font-size: 0.85rem;">
                ${sustitutosActuales.length >= 10 ? "⚠️ Límite de 10 sustitutos alcanzado" : "No hay jugadores disponibles"}
            </div>`;
        } else {
            containerAdd.innerHTML = jugadoresDisponibles.map(j => `
                <div class="player-card" style="justify-content: space-between;">
                    <span class="player-name">${j.nombre}</span>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <span class="player-power">${j.poder}</span>
                        <button class="btn" style="padding: 4px 8px; font-size: 0.7rem; background: linear-gradient(135deg, #f0a500, #e08900); color: #0a0f1c; border: none;" onclick="agregarSustitutoDesdeNombre('${j.nombre.replace(/'/g, "\\'")}')" title="Agregar como sustituto">+</button>
                    </div>
                </div>
            `).join("");
        }
        
        // Sección de sustitutos asignados
        const containerAssigned = document.getElementById("substitutesList");
        const sustitutos = asignacionesSustitutos.sustitutos || [];
        
        if (sustitutos.length === 0) {
            containerAssigned.innerHTML = `<div style="text-align: center; padding: 20px; color: #999;">Sin sustitutos asignados</div>`;
            containerAssigned.style.display = "block";
            return;
        }
        
        containerAssigned.style.display = "grid";
        containerAssigned.style.gridTemplateColumns = "1fr 1fr";
        containerAssigned.style.gap = "10px";
        
        containerAssigned.innerHTML = sustitutos.map((s, idx) => `
            <div style="background: linear-gradient(135deg, rgba(30, 36, 54, 0.8), rgba(20, 25, 40, 0.9)); border-radius: 14px; padding: 12px; border: 1px solid rgba(240, 165, 0, 0.2); display: flex; align-items: center; justify-content: space-between; gap: 6px;">
                <span style="color: #eef2ff; font-weight: 600; font-size: 0.8rem; flex: 1; word-break: break-word;">${s.nombre}</span>
                <button class="btn btn-danger" style="padding: 2px 5px; font-size: 0.6rem; flex-shrink: 0;" onclick="eliminarSustituto(${idx})">✕</button>
            </div>
        `).join("");
    }

    function mostrarTab(tabName) {
        const windowWidth = window.innerWidth;
        
        if (windowWidth > 1024) {
            // Desktop: ambos sidebars visibles
            return;
        }
        
        // Tablet/Mobile: tabs funcionales
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        document.getElementById('sidebarTitulares').classList.remove('open');
        document.getElementById('sidebarSustitutos').classList.remove('open');
        
        if (tabName === 'titulares') {
            document.getElementById('sidebarTitulares').classList.add('open');
        } else {
            document.getElementById('sidebarSustitutos').classList.add('open');
        }
    }

    function abrirSidebarSustitutos() {
        const windowWidth = window.innerWidth;
        if (windowWidth > 1024) {
            // En desktop, mostrar sidebar de sustitutos directamente
            actualizarListaSustitutos();
        } else {
            // En mobile/tablet, cambiar tab
            mostrarTab('sustitutos');
            actualizarListaSustitutos();
        }
    }

    function eliminarSustituto(indice) {
        asignacionesSustitutos.sustitutos.splice(indice, 1);
        guardarAsignaciones();
        actualizarListaSustitutos();
        mostrarToast("🗑️ Sustituto eliminado");
    }

    function agregarSustitutoDesdeNombre(nombre) {
        if (asignacionesSustitutos.sustitutos.length >= 10) {
            mostrarToast("⚠️ Máximo 10 sustitutos");
            return false;
        }
        
        // Buscar el jugador en la lista completa
        const jugador = jugadores.find(j => j.nombre === nombre);
        if (!jugador) {
            mostrarToast("❌ Jugador no encontrado");
            return false;
        }
        
        // Validar que no sea duplicado
        if (asignacionesSustitutos.sustitutos.some(s => s.nombre === jugador.nombre)) {
            mostrarToast("⚠️ Sustituto ya existe");
            return false;
        }
        
        asignacionesSustitutos.sustitutos.push(jugador);
        guardarAsignaciones();
        actualizarListaSustitutos();
        mostrarToast("✅ Sustituto agregado");
        return true;
    }
    
    function init() {
        cargarJugadores();
        cargarAsignaciones();
        renderizarMapa();
        
        // Inicializar Panzoom
        const mapContainer = document.getElementById("mapContainer");
        window.pz = Panzoom(mapContainer, {
            maxScale: 3,
            minScale: 1,
            contain: 'outside'
        });
        mapContainer.parentElement.addEventListener('wheel', window.pz.zoomWithWheel);

        // Añadir Jugador Manual
        document.getElementById("addPlayerBtn").onclick = () => {
            const name = document.getElementById("newPlayerName").value.trim();
            const power = document.getElementById("newPlayerPower").value.trim();
            if(!name || !power) {
                mostrarToast("⚠️ Completa ambos campos");
                return;
            }
            if(jugadores.find(j => j.nombre.toLowerCase() === name.toLowerCase())) {
                mostrarToast("⚠️ El jugador ya existe");
                return;
            }
            jugadores.unshift({ nombre: name, poder: power, estado: "Activo" }); // Añadir al inicio
            guardarJugadores();
            document.getElementById("newPlayerName").value = "";
            document.getElementById("newPlayerPower").value = "";
            actualizarListaJugadores();
            actualizarListaSustitutos();
            mostrarToast("✅ Jugador añadido");
        };

        // Exportar JSON
        document.getElementById("exportJsonBtn").onclick = () => {
            const data = {
                jugadores: jugadores,
                asignaciones: asignaciones,
                asignacionesSustitutos: asignacionesSustitutos
            };
            const jsonStr = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "tormenta_config.json";
            link.click();
            URL.revokeObjectURL(url);
            mostrarToast("💾 Configuración exportada");
        };

        // Importar JSON
        document.getElementById("importJsonBtn").onclick = () => {
            document.getElementById("fileInput").click();
        };

        document.getElementById("fileInput").onchange = (e) => {
            const file = e.target.files[0];
            if(!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const data = JSON.parse(ev.target.result);
                    if(data.jugadores) {
                        jugadores = data.jugadores;
                        guardarJugadores();
                    }
                    if(data.asignaciones && data.asignacionesSustitutos) {
                        asignaciones = data.asignaciones;
                        asignacionesSustitutos = data.asignacionesSustitutos;
                        guardarAsignaciones();
                    }
                    renderizarMapa();
                    actualizarListaJugadores();
                    actualizarListaSustitutos();
                    mostrarToast("📂 Configuración cargada");
                } catch(err) {
                    mostrarToast("❌ Error al leer el JSON");
                }
                e.target.value = ""; // reset
            };
            reader.readAsText(file);
        };
        
        document.getElementById("showPlayersBtn").onclick = mostrarSidebar;
        document.getElementById("closeSidebar").onclick = () => document.getElementById("sidebarTitulares").classList.remove("open");
        document.getElementById("closeSidebarSustitutos").onclick = () => document.getElementById("sidebarSustitutos").classList.remove("open");
        document.getElementById("closeModal").onclick = () => document.getElementById("modal").style.display = "none";
        document.getElementById("exportBtn").onclick = exportarImagen;
        document.getElementById("resetBtn").onclick = resetearAsignaciones;
        document.getElementById("filterStatus").onchange = () => {
            if (document.getElementById("sidebarTitulares").classList.contains("open")) actualizarListaJugadores();
        };
        document.getElementById("playerSearch").oninput = actualizarListaJugadores;
        document.getElementById("addSubstitutesSearch").oninput = actualizarListaSustitutos;
        document.getElementById("modalSearch").oninput = () => {
            const asignadosActuales = new Set(asignaciones[modalEstructuraActual] || []);
            renderizarModalJugadores(asignadosActuales);
        };
        
        // Event listeners para tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.onclick = () => {
                mostrarTab(btn.dataset.tab);
                if (btn.dataset.tab === 'sustitutos') {
                    actualizarListaSustitutos();
                } else {
                    actualizarListaJugadores();
                }
            };
        });
        
        document.getElementById("modal").onclick = (e) => {
            if (e.target === document.getElementById("modal")) {
                document.getElementById("modal").style.display = "none";
            }
        };
        
        // Listener para redimensionamiento de ventana
        window.addEventListener("resize", () => {
            renderizarMapa();
            const windowWidth = window.innerWidth;
            if (windowWidth > 1024) {
                document.getElementById('tabsHeader').style.display = 'none';
                document.getElementById('sidebarTitulares').style.right = 'auto';
                document.getElementById('sidebarSustitutos').style.left = 'auto';
            } else {
                document.getElementById('tabsHeader').style.display = 'flex';
            }
        });
    }
    
    init();

// ==================== NUEVAS FUNCIONES DE GESTIÓN ====================

window.eliminarJugador = function(nombre) {
    if(confirm(`¿Estás seguro de eliminar a ${nombre}?`)) {
        jugadores = jugadores.filter(j => j.nombre !== nombre);
        guardarJugadores();
        actualizarListaJugadores();
        actualizarListaSustitutos();
        
        let modificado = false;
        estructuras.forEach(e => {
            if(asignaciones[e.id] && asignaciones[e.id].includes(nombre)) {
                asignaciones[e.id] = asignaciones[e.id].filter(n => n !== nombre);
                modificado = true;
            }
        });
        
        if(asignacionesSustitutos.sustitutos && asignacionesSustitutos.sustitutos.some(s => s.nombre === nombre)) {
            asignacionesSustitutos.sustitutos = asignacionesSustitutos.sustitutos.filter(s => s.nombre !== nombre);
            modificado = true;
        }
        
        if(modificado) {
            guardarAsignaciones();
            renderizarMapa();
        }
        mostrarToast("🗑️ Jugador eliminado");
    }
};
