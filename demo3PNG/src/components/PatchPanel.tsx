import {
  Box,
  Button,
  Checkbox,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import React, { useEffect, useRef } from "react";
import Avatar from "./Avatar";
import configs from "../configs";
import useAvatar from "../hooks/useAvatar";
import { download, shuffle } from "../utils";
import styles from "./PatchPanel.module.css";

const PatchPanel = () => {
  const avatarRef = useRef<HTMLDivElement | null>(null);
  const { attributes, setAttributes } = useAvatar();

  const onShuffle = () => {
    const payload = shuffle();
    setAttributes(payload);
  };

  const onDownload = () => {
    if (!avatarRef.current) {
      return;
    }
    download(attributes, avatarRef.current);
  };

  useEffect(() => {
    onShuffle();
  }, []);

  const renderStickyList = () => {
    return (
      <List
        className={styles.listContainer}
        sx={{
          bgcolor: "background.paper",
        }}
      >
        {configs.layers.map((layer) => (
          <li key={`section-${layer}`}>
            <ul>
              <ListSubheader>{`${layer.toUpperCase()}`}</ListSubheader>
              {(configs.attributes[layer] || []).map((layerStyle) => (
                <ListItem key={`item-${layer}-${layerStyle}`}>
                  <ListItemButton
                    role={undefined}
                    onClick={() => setAttributes({ [layer]: layerStyle })}
                    dense
                  >
                    <ListItemIcon style={{ minWidth: 30 }}>
                      <Checkbox
                        edge="start"
                        checked={layerStyle === attributes[layer]}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText primary={`${layerStyle}`} />
                  </ListItemButton>
                </ListItem>
              ))}
            </ul>
          </li>
        ))}
      </List>
    );
  };

  const renderPreview = () => {
    return (
      <>
        <div className={styles.avatarContainer} ref={avatarRef}>
          <Avatar
            source={configs.pngSource}
            layers={configs.layers}
            attributes={attributes}
          />
        </div>
        <div className={styles.btnContainer}>
          <Button variant="contained" onClick={onShuffle}>
            Shuffle
          </Button>
          <Button variant="contained" onClick={onDownload}>
            Download
          </Button>
        </div>
      </>
    );
  };

  return (
    <Grid className={styles.patchPanelContainer} container spacing={0}>
      <Grid item xs={"auto"} className={styles.leftContainer}>
        {renderStickyList()}
      </Grid>
      <Grid item xs className={styles.rightContainer}>
        {renderPreview()}
      </Grid>
    </Grid>
  );
};

export default PatchPanel;
