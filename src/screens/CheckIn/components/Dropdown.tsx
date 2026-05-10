import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type Option = { label: string; value: string };

type Props = {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  error?: boolean;
};

export function Dropdown({
  value,
  onChange,
  options,
  placeholder,
  error,
}: Props) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={[styles.trigger, error && styles.triggerError]}
      >
        <Text style={selected ? styles.value : styles.placeholder}>
          {selected?.label ?? placeholder ?? 'Select'}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={{ flex: 1 }}>
          <Pressable onPress={() => setOpen(false)} style={styles.backdrop} />
          <View style={styles.bottomSlot}>
            <View style={styles.sheet}>
              <View style={styles.handleWrap}>
                <View style={styles.handle} />
              </View>
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => {
                  const sel = item.value === value;
                  return (
                    <Pressable
                      onPress={() => {
                        onChange(item.value);
                        setOpen(false);
                      }}
                      style={styles.row}
                    >
                      <Text style={sel ? styles.rowTextActive : styles.rowText}>
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerError: {
    borderColor: '#dc2626',
  },
  value: {
    color: '#0f172a',
    fontSize: 16,
  },
  placeholder: {
    color: '#94a3b8',
    fontSize: 16,
  },
  chevron: {
    color: '#94a3b8',
    fontSize: 12,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  bottomSlot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
    maxHeight: 384,
  },
  handleWrap: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#cbd5e1',
    borderRadius: 9999,
  },
  row: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  rowText: {
    fontSize: 16,
    color: '#0f172a',
  },
  rowTextActive: {
    fontSize: 16,
    color: '#1D9E75',
    fontWeight: '600',
  },
});
