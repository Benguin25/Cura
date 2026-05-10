import { useState } from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';

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
        className={`bg-white border rounded-xl px-3 py-3.5 flex-row items-center justify-between ${
          error ? 'border-red-400' : 'border-slate-200'
        }`}
      >
        <Text
          className={
            selected
              ? 'text-slate-900 text-base'
              : 'text-slate-400 text-base'
          }
        >
          {selected?.label ?? placeholder ?? 'Select'}
        </Text>
        <Text className="text-slate-400 text-xs">▾</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => setOpen(false)}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
            }}
          />
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <View className="bg-white rounded-t-3xl pb-8 max-h-96">
              <View className="items-center pt-3 pb-1">
                <View className="w-10 h-1 bg-slate-300 rounded-full" />
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
                      className="px-5 py-3.5"
                    >
                      <Text
                        className={`text-base ${
                          sel
                            ? 'text-[#1D9E75] font-semibold'
                            : 'text-slate-900'
                        }`}
                      >
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
