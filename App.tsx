import axios from 'axios';
import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';

export default function App() {
  const api = 'https://jsonplaceholder.typicode.com/users';
  const [results, setResults] = useState<Record<string, string>[]>([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [debounceQuery, setDebounceQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoading, setisloading] = useState(false);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setLoading(true);
        const res = await axios(api);
        const result = await res.data;
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const displayResult: {name: string}[] = result?.map((res: any) => ({
          name: res.name,
        }));
        if (displayResult.length) {
          setResults(displayResult);
          setError('');
        }
      } catch (e: unknown) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApi();
  }, []);

  const debounce = (cb: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        cb(...args);
        setisloading(false);
      }, delay);
    };
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDebounceRes = useCallback(
    debounce((text: string) => {
      setDebounceQuery(text);
    }, 800),
    [],
  );

  const handleChange = (text: string) => {
    setQuery(text);
    handleDebounceRes(text);
    setisloading(true);
  };

  const displayName = results?.filter(res => res.name.includes(debounceQuery));

  if (loading) {
    return (
      <SafeAreaView style={styles.safeAreaWrapper}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeAreaWrapper}>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  if (!displayName) {
    return (
      <SafeAreaView style={styles.safeAreaWrapper}>
        <Text>No result found...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text>Search</Text>
      <TextInput
        value={query}
        onChangeText={handleChange}
        style={styles.textInput}
      />
      {isLoading && <ActivityIndicator />}
      {displayName?.map((res, i) => (
        <Text key={i}>{res.name}</Text>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  textInput: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  safeAreaWrapper: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
    padding: 8,
  },
});
