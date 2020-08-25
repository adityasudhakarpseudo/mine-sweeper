import React from "react";
import { Statistic, InputNumber, Input, Rate } from "antd";

const { Countdown } = Statistic;
Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}
const deadline = new Date().addHours(1);

export default function Configuration(props) {
  return (
    <div className="configuration">
      <table>
        <tbody>
          <tr>
            <td>
              <div className="form-group">
                <label>Mines Count</label>
                <div>{props.config.activeMines || 0}</div>
              </div>
            </td>
            <td>
              <div className="mid-section">
                <div className="form-group">
                  <div>{props.config.score || 0}</div>
                </div>
                <div className="form-group">
                  <label>Grid Size</label>
                  <Input.Group compact>
                    <InputNumber
                      style={{ width: "75px" }}
                      value={props.config.dimentions.x}
                      onChange={value => props.updateDimentions(value, "x")}
                    />
                    <InputNumber
                      style={{ width: "75px" }}
                      value={props.config.dimentions.y}
                      onChange={value => props.updateDimentions(value, "y")}
                    />
                  </Input.Group>
                </div>
                <div className="form-group">
                  <label>Difficulty</label>
                  <div>
                    <Rate
                      tooltips={props.config.difficulties}
                      value={props.config.difficultyLevel}
                      onChange={(e) => props.updateDifficulty(e)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <a
                    href={"javascript:void(0)"}
                    onClick={e => props.resetGrid(e)}
                  >
                    Reset Grid
                  </a>
                </div>
              </div>
            </td>
            <td>
              <div className="form-group">
                <Countdown
                  title="Countdown"
                  value={deadline}
                  onFinish={() => props.updateGridConfig(props.dataConfig, 'game_over')}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
