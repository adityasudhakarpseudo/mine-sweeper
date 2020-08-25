import React from "react";

import Configuration from "./Partials/Configuration";
import GameGrid from "./Partials/GameGrid";

import "./stylesheet.scss";

class MineSweep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gridDimentions: {
        x: 10,
        y: 10
      },
      gridConfig: [],
      gridDifficulty: 10,
      activeMinesCount: 10,
      currentScore: 0,
      _isGameOver: false,
      _isGameComplete: false,
      difficultyLevel: 1
    };
  }

  difficulties = ["Easy", "Medium", "Hard", "Advanced", "Expert"];

  componentDidMount() {
    this._intializeView();
  }

  _intializeView = () => {
    let grid_config = [];
    for (let i = 0; i < this.state.gridDimentions["x"]; i++) {
      let rowArray = [];
      for (let j = 0; j < this.state.gridDimentions["y"]; j++) {
        let cellConfig = {
          isMine: false,
          isVisited: false,
          isBookmarked: false,
          adjacentMines: 0
        };
        rowArray.push(cellConfig);
      }
      grid_config.push(rowArray);
    }
    grid_config = this._addMinesToGrid(grid_config);
    return this._updateGridConfig(grid_config);
  };

  _addMinesToGrid = grid_config => {
    let visitedHashes = [];
    const generateRandomIndices = type => {
      return Math.floor(Math.random() * this.state.gridDimentions[type]);
    };
    for (let i = 0; i < this.state.gridDifficulty; i++) {
      const assignMines = () => {
        let row = generateRandomIndices("x");
        let col = generateRandomIndices("y");
        if (
          visitedHashes.length &&
          visitedHashes.filter((item, key) => {
            return item.row === row && item.col === col;
          }).length
        ) {
          assignMines();
        } else {
          visitedHashes.push({
            row: row,
            col: col
          });
        }
        grid_config[row][col].isMine = true;
      };
      assignMines();
    }
    return grid_config;
  };

  _updateGridConfig = (config, type) => {
    this.setState(
      {
        gridConfig: config,
        activeMinesCount: this._getCounts(config, "mine"),
        currentScore: this._getCounts(config, "score"),
        _isGameOver: type === "game_over" ? true : false
      },
      () => {
        if (this.state._isGameOver) {
          let gridConfig = [...this.state.gridConfig];
          for (let i = 0; i < gridConfig.length; i++) {
            for (let j = 0; j < gridConfig[i].length; j++) {
              if (gridConfig[i][j].isMine) {
                gridConfig[i][j].isVisited = true;
              }
            }
          }

          this.setState({
            gridConfig: gridConfig
          });
        }
      }
    );
  };

  _getCounts = (gridConfig, type) => {
    let mineCount = 0;
    let score = 0;
    for (let i = 0; i < gridConfig.length; i++) {
      for (let j = 0; j < gridConfig[i].length; j++) {
        score = score + gridConfig[i][j].adjacentMines || 0;
        if (gridConfig[i][j].isMine) {
          mineCount++;
          if (gridConfig[i][j].isVisited || gridConfig[i][j].isBookmarked) {
            mineCount--;
          }
        }
      }
    }
    if (type === "mine") {
      return mineCount;
    } else if (type === "score") {
      return score;
    }
  };

  _resetGrid = (updated_dimentions, updated_difficulty, difficulty_level) => {
    this.setState(
      {
        gridDimentions: updated_dimentions || {
          x: 10,
          y: 10
        },
        gridConfig: [],
        gridDifficulty: updated_difficulty || 10,
        difficultyLevel: difficulty_level || 1,
        activeMinesCount: 20,
        currentScore: 0,
        _isGameOver: false
      },
      () => {
        this._intializeView();
      }
    );
  };

  _updateDimentions = (data, identifier) => {
    let updated_dimentions = { ...this.state.gridDimentions };
    updated_dimentions[identifier] = parseInt(data) >= 10 ? parseInt(data) : 10;
    // debugger;
    this.setState(
      {
        gridDimentions: updated_dimentions
      },
      () => {
        this._resetGrid(updated_dimentions);
      }
    );
  };

  _updateDifficulty = data => {
    if (data === 0) {
      return;
    }
    let mappings = this.difficulties.map((item, key) => {
      return {
        [item]: (key + 1) * 10
      };
    });
    this.setState(
      {
        difficultyLevel: data,
        gridDifficulty: Object.values(mappings[data - 1])[0]
      },
      () => {
        this._resetGrid(
          this.state.gridDimentions,
          this.state.gridDifficulty,
          data
        );
      }
    );
  };

  _updateGameCompletionStatus = (value) => {
    this.setState({
      _isGameComplete: value
    })
  }

  render() {
    return (
      <div className="page-minesweep-wrap">
        <div className="banner">
          <img src="/minesweeper.png" />
        </div>
        <Configuration
          config={{
            activeMines: this.state.activeMinesCount,
            score: this.state.currentScore,
            dimentions: this.state.gridDimentions,
            difficultyLevel: this.state.difficultyLevel,
            difficulties: this.difficulties
          }}
          dataConfig={this.state.gridConfig}
          resetGrid={() => this._resetGrid()}
          updateGridConfig={this._updateGridConfig}
          updateDimentions={this._updateDimentions}
          updateDifficulty={this._updateDifficulty}
        />
        <GameGrid
          config={this.state.gridConfig || []}
          updateGridConfig={this._updateGridConfig}
          isGameOver={this.state._isGameOver}
          isGameComplete={this.state._isGameComplete}
          updateGameCompletionStatus={this._updateGameCompletionStatus}
        />
      </div>
    );
  }
}

export default MineSweep;
