import React from "react";

export default function GameGrid(props) {
  function _handleCellClick(config_path, misc) {
    if(props.isGameOver){
      return false;
    }
    let updated_config = JSON.parse(JSON.stringify(props.config));
    if (config_path.cell.item.isMine) {
      alert('Oops !! You clicked on a Mine. Better luck next time.')
      updated_config = _gameOver(config_path, misc);
    } else {
      updated_config = _checkAndRevealAdjacentCells(config_path, misc);
    }
    props.updateGridConfig(updated_config, config_path.cell.item.isMine ? 'game_over' : '');
    if(!config_path.cell.item.isMine){
      _checkGameCompletion(updated_config);
    }
  }

  function _checkGameCompletion(dataConfig){
    let _isGameComplete = true;
    for (let i = 0; i < dataConfig.length; i++) {
      for (let j = 0; j < dataConfig[i].length; j++) {
        if(!dataConfig[i][j].isVisited){
          _isGameComplete = false;
          break;
        }
      }
      if(_isGameComplete){
        break;
      }
    }
    props.updateGameCompletionStatus(_isGameComplete);
  }

  function _gameOver(config_path, misc) {
    let updated_config = JSON.parse(JSON.stringify(props.config));
    updated_config[config_path.row.key][config_path.cell.key][
      "isVisited"
    ] = true;
    return updated_config;
  }

  function _checkAndRevealAdjacentCells(config_path, dataConfig) {
    let updated_config = dataConfig || JSON.parse(JSON.stringify(props.config));
    let adjancent_mines_count = _findAdjacentMines(updated_config, config_path);
    updated_config[config_path.row.key][config_path.cell.key][
      "isVisited"
    ] = true;
    updated_config[config_path.row.key][config_path.cell.key][
      "adjacentMines"
    ] = adjancent_mines_count;

    if (adjancent_mines_count === 0) {
      updated_config = _revealAdjacentCells(updated_config, config_path);
    }

    return updated_config;
  }

  function _findAdjacentMines(dataConfig, config_path) {
    let mineCount = 0;
    let iterate_config = _adjacentMinesConfig(config_path);
    mineCount = _runConstantIndices(dataConfig, iterate_config, "mine");
    return mineCount;
  }

  function _adjacentMinesConfig(config_path) {
    return {
      i: {
        start: Math.max(config_path.row.key - 1, 0),
        end: Math.min(config_path.row.key + 1, 9)
      },
      j: {
        start: Math.max(config_path.cell.key - 1, 0),
        end: Math.min(config_path.cell.key + 1, 9)
      }
    };
  }

  function _runConstantIndices(dataConfig, iterate_config, type = "count") {
    let count = 0;
    for (
      let i = iterate_config["i"]["start"];
      i <= iterate_config["i"]["end"];
      i++
    ) {
      for (
        let j = iterate_config["j"]["start"];
        j <= iterate_config["j"]["end"];
        j++
      ) {
        if (dataConfig[i][j].isMine === true) {
          count++;
        }
      }
    }
    if (type === "count" || type === "mine") {
      return count;
    }
  }

  function _revealAdjacentCells(dataConfig, config_path) {
    let iterate_config = _adjacentMinesConfig(config_path);
    for (
      let i = iterate_config["i"]["start"];
      i <= iterate_config["i"]["end"];
      i++
    ) {
      for (
        let j = iterate_config["j"]["start"];
        j <= iterate_config["j"]["end"];
        j++
      ) {
        let path = {
          cell: {
            key: j,
            item: dataConfig[i][j]
          },
          row: {
            key: i,
            item: dataConfig[i]
          }
        };
        dataConfig[i][j]["adjacentMines"] = _runConstantIndices(
          dataConfig,
          _adjacentMinesConfig(path),
          "mine"
        );
        dataConfig[i][j]["isVisited"] = true;
      }
    }
    return dataConfig;
  }

  return (
    <div className="game-grid">
      <table className={props.isGameOver ? 'game-over' : props.isGameComplete ? ' game-complete' : ''}>
        <tbody>
          {props.config && props.config.length
            ? props.config.map((rowItem, rowKey) => (
                <tr key={rowKey}>
                  {rowItem.map((cellItem, cellKey) => (
                    <td
                      className={cellItem.isVisited ? " td-clicked" : ""}
                      onClick={e =>
                        !cellItem.isVisited
                          ? _handleCellClick({
                              cell: {
                                item: cellItem,
                                key: cellKey
                              },
                              row: {
                                item: rowItem,
                                key: rowKey
                              }
                            })
                          : null
                      }
                      key={rowKey + "" + cellKey}
                    >
                      {cellItem.isVisited && !cellItem.isMine
                        ? cellItem.adjacentMines || 0
                        : ""}
                      {cellItem.isVisited && cellItem.isMine ? (
                        <img src="https://img.icons8.com/emoji/25/000000/bomb-emoji.png" />
                      ) : null}
                    </td>
                  ))}
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </div>
  );
}
