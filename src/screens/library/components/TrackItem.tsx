import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
// import { isUndefined, isEqual } from 'lodash'
import { deleteDownload } from '../../../actions/downloads';
import { loadTrack } from '../../../actions/playerState';
import { RootReducerType } from '../../../reducers';
import { TrackProps } from '../../../utils/types';
import FastImage from 'react-native-fast-image';
import { DefaultImage } from '../../../components/DefaultImage';
import { IconButton, List } from 'react-native-paper';
import ActiveTrackIcon from '../../../components/ActiveTrackIcon';

export interface TrackItemProps {
    track: TrackProps
}

export function TrackItem({ track, onRightIconPress }: TrackItemProps) {
    const [isActive, setActive] = React.useState(false);
    const dispatch = useDispatch();
    const active = useSelector(
        (state: RootReducerType) => state.playerState.active,
    );

    // React.useEffect(() => {
    //     if (!isUndefined(active) && track.id) {
    //         setActive(isEqual(active.id, track.id));
    //     }
    // }, [active, track]);

    const play = () => {
        if (!isActive) {
            dispatch(loadTrack(track));
        }

    };

    return (
        <View>
            <List.Item
                title={track?.title}
                description={track?.artist || track?.album}
                left={() =>
                    track?.cover ? (
                        <FastImage source={{ uri: track.cover }} style={styles.artwork} />
                    ) : (
                        <DefaultImage style={styles.artwork} />
                    )
                }
                right={props =>
                    // active ? (
                    //     <ActiveTrackIcon
                    //         style={[{ height: 50, width: 30, marginLeft: 4 }, props.style]}
                    //     />
                    // ) : (
                    <IconButton
                        icon="trash-outline"
                        onPress={() => onRightIconPress(track)}
                        {...props}
                    />

                    // )
                }
                onPress={() => play()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    surface: {
        padding: 0,
        margin: 0,
        borderRadius: 4,
    },
    artwork: {
        backgroundColor: '#d7d1c9',
        borderRadius: 4,
        height: 50,
        width: 50,
    },
});
