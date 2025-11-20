# 👑 CR Trainer

Um projeto simples desenvolvido em Python para auxiliar jogadores de Clash Royale a memorizar cartas e realizar escolhas estratégicas rápidas durante batalhas.

Este projeto utiliza um arquivo CSV (`cards.csv`) para armazenar informações das cartas e oferece um modo de "treino" onde o usuário é testado sobre a melhor escolha de carta para neutralizar ameaças específicas.

## 🌟 Funcionalidades

* **Treino de Cartas para Memorização:** O usuário escolhe uma carta, e o sistema pergunta qual o valor de elixir daquela carta
* **Gestão de Cartas:** Permite adicionar, remover e visualizar cartas no banco de dados (`cards.csv`).
* **Implementação em Python:** Fácil de entender e modificar.

## 🛠️ Tecnologias Utilizadas

* **Python:** Linguagem principal do projeto.
* **Pandas:** Usado para manipulação e leitura do arquivo CSV de cartas.

## ⚙️ Instalação e Configuração

Para rodar este projeto localmente, siga os passos abaixo:

### Pré-requisitos

Certifique-se de ter o **Python** instalado em sua máquina (versão 3.x recomendada).

### Passos

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/Fredon1301/CR_Trainer.git](https://github.com/Fredon1301/CR_Trainer.git)
    cd CR_Trainer
    ```

2.  **Crie e ative um ambiente virtual (Opcional, mas Recomendado):**
    ```bash
    python -m venv venv
    # No Windows:
    .\venv\Scripts\activate
    # No Linux/macOS:
    source venv/bin/activate
    ```

3.  **Instale as dependências:**
    ```bash
    pip install -r requirements.txt
    ```

## ▶️ Como Usar

Após a instalação, você pode iniciar o treinador:

```bash
python cr_trainer.py


