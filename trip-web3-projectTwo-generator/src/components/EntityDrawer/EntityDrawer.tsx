import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { Entity, Inventory, Layer } from "../../types";
import Avatar from "../Avatar";
import styles from "./EntityDrawer.module.css";
import createDNA from "../../utils/createDNA";

export type EntityDrawerProps = {
  open: boolean;
  onClose: () => void;
  entities: Array<Entity>;
  onSelectEntity: (index: number) => void;
  layers: Array<Layer>;
  inventorySrc: Inventory<string>;
};

const EntityDrawer = ({
  open,
  onClose,
  entities,
  onSelectEntity,
  layers,
  inventorySrc,
}: EntityDrawerProps) => {
  return (
    <Drawer open={open} onClose={onClose} direction="right">
      <div className={styles.container}>
        <div className={styles.innerContainer}>
          {entities.length === 0 ? (
            <div>There is no locked entities.</div>
          ) : null}
          {entities.map((entity, index) => (
            <div
              key={createDNA(entity)}
              className={styles.item}
              onClick={() => {
                onSelectEntity(index);
              }}
            >
              <Avatar
                entity={entity}
                layers={layers}
                inventorySrc={inventorySrc}
                className={styles.avatar}
              />
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  );
};

export default EntityDrawer;
