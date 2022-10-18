import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import styles from "./ShufflePanel.module.css";
import useBatch from "../hooks/useBatch";
import Avatar from "./Avatar";
import configs from "../configs";
import { Pagination, Stack } from "@mui/material";

const ShufflePanel = () => {
  const { entities, selected, onNextBatch, onSelected } = useBatch();

  const onBatchSave = () => {
    // TODO
  };

  const renderLeftPanel = () => {
    return (
      <Card variant="outlined" className={styles.leftPanelCard}>
        <h2>Configure Panel</h2>
        <h2>...</h2>
      </Card>
    );
  };

  const renderBatch = () => {
    return (
      <Grid container className={styles.batchContainer}>
        {entities.map((entity, idx) => {
          return (
            <div key={idx} className="p-2 text-center">
              <Avatar
                source={configs.pngSource}
                layers={configs.layers}
                attributes={entity}
                className={styles.smallAvatar}
              />
              <Checkbox
                checked={!!selected[idx]}
                onClick={() => onSelected(idx)}
              />
            </div>
          );
        })}
      </Grid>
    );
  };

  const renderActionButtons = () => {
    return (
      <div className="block p-10 mh-20 w-full text-center">
        <Button variant="contained" className="mr-4" onClick={onBatchSave}>
          批量生成
        </Button>
        <Button variant="contained" onClick={onNextBatch}>
          下一波
        </Button>
      </div>
    );
  };

  /* return (
    <div className="flex flex-1 w-full">
      {renderLeftPanel()}

      <div className="flex-1">
        {renderBatch()}
        {renderActionButtons()}
      </div>
    </div>
  ); */

  return (
    <Grid className={styles.shufflePanelContainer} container spacing={0}>
      <Grid item xs={"auto"} className={styles.leftContainer}></Grid>
      <Grid item xs className={styles.rightContainer}>
        <div className={styles.avatarListContainer}>avatar list</div>
        <Stack spacing={2} padding={"10px"}>
          <Pagination count={10} shape="rounded" />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default ShufflePanel;
