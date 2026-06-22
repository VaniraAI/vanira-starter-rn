import React, {useEffect, useMemo, useRef} from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useVaniraCall} from '@vanira/react-native-sdk/headless';

const ORB_SIZE = 152;
const FIELD_SIZE = 240;

/** Siri-style iridescent blob colors */
const BLOB_COLORS = ['#FF375F', '#AF52DE', '#5E5CE6', '#32ADE6', '#64D2FF'];

type BlobSpec = {
  color: string;
  size: number;
  radius: number;
  duration: number;
  reverse?: boolean;
};

const BLOBS: BlobSpec[] = [
  {color: BLOB_COLORS[0], size: 88, radius: 28, duration: 4200},
  {color: BLOB_COLORS[1], size: 92, radius: 34, duration: 5100, reverse: true},
  {color: BLOB_COLORS[2], size: 86, radius: 22, duration: 3800},
  {color: BLOB_COLORS[3], size: 80, radius: 30, duration: 4600, reverse: true},
  {color: BLOB_COLORS[4], size: 72, radius: 18, duration: 3400},
];

function FluidBlob({
  spec,
  active,
  speaking,
}: {
  spec: BlobSpec;
  active: boolean;
  speaking: boolean;
}) {
  const orbit = useRef(new Animated.Value(0)).current;
  const wobble = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const speed = active ? (speaking ? 0.55 : 0.75) : 1;
    const loop = Animated.loop(
      Animated.timing(orbit, {
        toValue: 1,
        duration: spec.duration * speed,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [active, orbit, spec.duration, speaking]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(wobble, {
          toValue: 1,
          duration: active ? (speaking ? 520 : 900) : 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(wobble, {
          toValue: 0,
          duration: active ? (speaking ? 520 : 900) : 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [active, speaking, wobble]);

  const spin = orbit.interpolate({
    inputRange: [0, 1],
    outputRange: spec.reverse ? ['360deg', '0deg'] : ['0deg', '360deg'],
  });

  const translateX = orbit.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, spec.radius, 0, -spec.radius, 0],
  });
  const translateY = orbit.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [-spec.radius, 0, spec.radius, 0, -spec.radius],
  });

  const scale = wobble.interpolate({
    inputRange: [0, 1],
    outputRange: active ? (speaking ? [0.92, 1.14] : [0.96, 1.06]) : [0.98, 1.02],
  });

  const opacity = active ? (speaking ? 0.92 : 0.82) : 0.68;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.blobOrbit,
        {transform: [{rotate: spin}]},
      ]}>
      <Animated.View
        style={[
          styles.blob,
          {
            width: spec.size,
            height: spec.size,
            borderRadius: spec.size / 2,
            backgroundColor: spec.color,
            opacity,
            transform: [{translateX}, {translateY}, {scale}],
          },
        ]}
      />
    </Animated.View>
  );
}

function SiriGlow({active, speaking, scale}: {active: boolean; speaking: boolean; scale: Animated.AnimatedMultiplication<number>}) {
  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.haloOuter,
          {
            opacity: active ? (speaking ? 0.45 : 0.32) : 0.22,
            transform: [{scale}],
          },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.haloInner,
          {
            opacity: active ? 0.55 : 0.35,
            transform: [{scale}],
          },
        ]}
      />
    </>
  );
}

function statusLabel(
  callUiActive: boolean,
  starting: boolean,
  status: string,
  muted: boolean,
  voiceActivity: string,
  error: string | null,
): string {
  if (!callUiActive) {
    return error ? error : 'Tap to talk';
  }
  if (starting || status === 'connecting') {
    return 'Connecting';
  }
  if (status === 'error') {
    return error ?? 'Couldn’t connect';
  }
  if (muted) {
    return 'Microphone off';
  }
  if (voiceActivity === 'speaking') {
    return 'Speaking';
  }
  return 'Listening';
}

export function HeadlessVoiceCall() {
  const {
    status,
    callUiActive,
    starting,
    muted,
    isSpeaking = false,
    voiceActivity = 'idle',
    hasSavedSession,
    error,
    startCall,
    stopCall,
    toggleMute,
  } = useVaniraCall();

  const live = callUiActive && (starting || status === 'connecting' || status === 'connected');
  const connecting = live && (starting || status === 'connecting');
  const connected = live && status === 'connected' && !starting;
  const speakingActive =
    connected && !muted && (voiceActivity === 'speaking' || isSpeaking);

  const emerge = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(0)).current;
  const labelFade = useRef(new Animated.Value(0)).current;
  const controlsFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(emerge, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(labelFade, {
        toValue: 1,
        delay: 200,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(controlsFade, {
        toValue: 1,
        delay: 350,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [controlsFade, emerge, labelFade]);

  useEffect(() => {
    const duration = connecting ? 750 : speakingActive ? 560 : live ? 1200 : 1800;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [breathe, connecting, live, speakingActive]);

  const label = useMemo(
    () => statusLabel(callUiActive, starting, status, muted, voiceActivity, error),
    [callUiActive, error, muted, starting, status, voiceActivity],
  );

  const handleOrbPress = () => {
    if (live) {
      return;
    }
    void startCall(hasSavedSession ? 'continue' : 'new');
  };

  const orbScale = Animated.multiply(
    emerge.interpolate({
      inputRange: [0, 0.75, 1],
      outputRange: [0.2, 1.06, 1],
    }),
    breathe.interpolate({
      inputRange: [0, 1],
      outputRange: [1, connecting ? 1.05 : speakingActive ? 1.08 : live ? 1.03 : 1.02],
    }),
  );

  return (
    <View style={styles.wrap}>
      <View style={styles.field}>
        <SiriGlow active={live} speaking={speakingActive} scale={orbScale} />

        <Pressable
          onPress={handleOrbPress}
          disabled={live}
          accessibilityRole="button"
          accessibilityLabel={live ? 'Assistant active' : 'Start voice assistant'}>
          <Animated.View
            style={[
              styles.orbClip,
              connecting && styles.orbClipConnecting,
              {transform: [{scale: orbScale}]},
            ]}>
            <View style={styles.orbBase} />
            {BLOBS.map((spec, index) => (
              <FluidBlob
                key={index}
                spec={spec}
                active={live}
                speaking={speakingActive}
              />
            ))}
            <View style={styles.orbSheen} pointerEvents="none" />
          </Animated.View>
        </Pressable>
      </View>

      <Animated.Text style={[styles.status, {opacity: labelFade}]}>{label}</Animated.Text>

      <Animated.View style={[styles.controls, {opacity: controlsFade}]}>
        {live ? (
          <View style={styles.liveControls}>
            <Pressable
              style={[styles.chip, muted && styles.chipMuted]}
              onPress={toggleMute}
              disabled={!connected}
              accessibilityLabel={muted ? 'Unmute' : 'Mute'}>
              <Text style={[styles.chipText, muted && styles.chipTextMuted]}>
                {muted ? 'Unmute' : 'Mute'}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.chip, styles.chipEnd]}
              onPress={stopCall}
              accessibilityLabel="End">
              <Text style={[styles.chipText, styles.chipTextEnd]}>Done</Text>
            </Pressable>
          </View>
        ) : hasSavedSession ? (
          <Pressable onPress={() => void startCall('new')} hitSlop={8}>
            <Text style={styles.secondaryLink}>Start new conversation</Text>
          </Pressable>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  field: {
    width: FIELD_SIZE,
    height: FIELD_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  haloOuter: {
    position: 'absolute',
    width: ORB_SIZE + 72,
    height: ORB_SIZE + 72,
    borderRadius: (ORB_SIZE + 72) / 2,
    backgroundColor: '#c4b5fd',
  },
  haloInner: {
    position: 'absolute',
    width: ORB_SIZE + 36,
    height: ORB_SIZE + 36,
    borderRadius: (ORB_SIZE + 36) / 2,
    backgroundColor: '#93c5fd',
  },
  orbClip: {
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1c1c1e',
    shadowColor: '#5856D6',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 12,
  },
  orbClipConnecting: {
    shadowColor: '#AF52DE',
    shadowOpacity: 0.42,
  },
  orbBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#2c2c2e',
  },
  blobOrbit: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blob: {
    position: 'absolute',
  },
  orbSheen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: ORB_SIZE / 2,
  },
  status: {
    marginTop: 28,
    fontSize: 17,
    fontWeight: '500',
    color: '#3c3c43',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  controls: {
    marginTop: 18,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveControls: {
    flexDirection: 'row',
    gap: 12,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: 'rgba(60,60,67,0.08)',
  },
  chipMuted: {
    backgroundColor: 'rgba(255,59,48,0.1)',
  },
  chipEnd: {
    backgroundColor: 'rgba(60,60,67,0.06)',
  },
  chipText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3c3c43',
  },
  chipTextMuted: {
    color: '#ff3b30',
  },
  chipTextEnd: {
    color: '#007aff',
  },
  secondaryLink: {
    fontSize: 15,
    fontWeight: '500',
    color: '#007aff',
  },
});
