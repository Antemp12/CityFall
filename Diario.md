Sessão 1 – 02 de dezembro de 2025
Objetivo: Mapa e menu de entrada
Atividades realizadas:
    - Menu de entrada implementado e funcional
    - Estrutura inicial do mapa
    - Integração de bibliotecas base (Phaser.js)
Problemas:
    - O mapa não estava a carregar corretamente nem o menu interagia como esperado.
Solução:
    - Criar um mapa novo usando Tiled e garantir a correta exportação e carregamento no Phaser. Refatorar o código do menu para responder a eventos de clique.
Decisões:
    - Utilizar Tiled para criação de mapas.
    - Estruturar o jogo em múltiplas cenas (MenuScene, GameScene).

Biblio deste dia 
https://deevid.ai/pt/image-to-video?utm_source=google&utm_source=google&utm_medium=cpc&utm_medium=cpc&utm_campaign=m-pmax703&utm_campaign=m-pmax703&utm_term=p2v&utm_content=pc&utm_content=pc&gad_source=1&gad_campaignid=22747336223&gbraid=0AAAAAq898mOPgrhs9-xFEci04F4DDHec7&gclid=Cj0KCQiAubrJBhCbARIsAHIdxD9V3USp64fE-njPK4WYT2Oxa53XQAdfooZrzYuZaGo3wLxX-AgdwkYaApXnEALw_wcB

Sessão 2 – 03 de dezembro de 2025
Objetivo: Carregamento do mapa e tilesets
Atividades realizadas:
    - Implementação da GameScene e carregamento do tilemap "MapaInicial.json".
    - Carregamento de tilesets "solo.png", "Tree2.png", "Rock2.png", etc.
    - Configuração da câmera para seguir o jogador (ainda não implementado).
Problemas:
    - Criação e posicionamento dos elementos do mapa (tiles e objetos) estava complexo e desorganizado.
    - Colisões com o tilemap não funcionavam como esperado.
Solução:
    - Refatorar a lógica de carregamento do mapa e definir camadas de colisão no Tiled.
    - Criar um sistema de debug para visualizar as camadas de colisão.
Decisões:
    - Refazer o mapa no Tiled com camadas de colisão claras.
    - Priorizar a funcionalidade do mapa antes de implementar o jogador.

Sessão 3 – 04 de dezembro de 2025
Objetivo: Implementação básica do jogador e movimento
Atividades realizadas:
    - Criação da classe Player com spritesheet "personagem/ataque.png" (placeholder).
    - Adição de controles de teclado para movimento (cima, baixo, esquerda, direita).
    - Configuração de física básica para o jogador.
Problemas:
    - Movimento do jogador estava "escorregadio" e não respondia bem aos inputs.
    - Animações do jogador não estavam sincronizadas com o movimento.
Solução:
    - Ajustar a aceleração e fricção da física do jogador.
    - Criar e gerenciar animações de Idle e Walk para o jogador.
Decisões:
    - Usar `this.physics.add.collider` para colisões entre o jogador e o tilemap.
    - Definir estados para o jogador (Idle, Walking, Attacking).

Sessão 4 – 05 de dezembro de 2025
Objetivo: Implementação de inimigos básicos e sistema de ondas
Atividades realizadas:
    - Criação das classes FlyRobot e SpiderRobot (inimigos básicos).
    - Inimigos com movimento simples e detecção de jogador.
    - Implementação inicial da WaveManager para spawn de inimigos.
Problemas:
    - Inimigos não estavam a ser corretamente spawnados ou seguiam o jogador de forma errática.
    - Dificuldade em gerenciar múltiplos inimigos e suas interações.
Solução:
    - Refatorar o sistema de spawn da WaveManager para usar temporizadores e grupos de inimigos.
    - Implementar lógica de perseguição mais robusta para os inimigos.
Decisões:
    - Cada inimigo terá um HP e um ataque básico.
    - As ondas de inimigos aumentarão em dificuldade.

Sessão 5 – 06 de dezembro de 2025
Objetivo: Interface de utilizador (HUD) e barra de vida
Atividades realizadas:
    - Criação da HUDScene para exibir informações do jogo (vida do jogador, pontuação, etc.).
    - Implementação de uma barra de vida para o jogador.
    - Exibição de texto simples para pontuação e tempo.
Problemas:
    - A HUD não estava a ser atualizada em tempo real com os dados da GameScene.
    - Dificuldade em posicionar elementos da UI de forma responsiva.
Solução:
    - Usar eventos do Phaser para comunicação entre a GameScene e a HUDScene.
    - Ancorar elementos da UI em posições relativas à tela.
Decisões:
    - A HUD será uma cena separada para melhor organização e performance.
    - Adicionar ícones e elementos visuais à HUD gradualmente.

Sessão 6 – 08 de dezembro de 2025
Objetivo: Sistema de ataque do jogador e detecção de colisões com inimigos
Atividades realizadas:
    - Implementação do ataque do jogador (e.g., disparo de projéteis ou ataque melee).
    - Detecção de colisão entre os ataques do jogador e os inimigos.
    - Redução da vida dos inimigos ao serem atingidos.
Problemas:
    - A lógica de colisão e dano entre ataques e inimigos era inconsistente.
    - Efeitos visuais para ataques e acertos ainda não implementados.
Solução:
    - Utilizar grupos de Phaser para gerenciar projéteis e inimigos, facilitando a detecção de colisões.
    - Implementar `this.physics.add.overlap` para detectar acertos sem parar o movimento.
Decisões:
    - Adicionar animações de acerto (hit feedback) para inimigos.
    - Balancear o dano do jogador e a vida dos inimigos.