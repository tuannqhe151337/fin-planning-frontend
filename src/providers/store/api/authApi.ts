import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LocalStorageItemKey } from "./type";

export interface LoginBody {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  data: UserResponse;
}

export interface UserResponse {
  userId: number;
  username: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  dob: string;
  address: string;
  role: Role;
  position: Position;
  department: Department;
  settings: UserSetting;
}

export interface Department {
  id: string | number;
  name: string;
}

export interface Role {
  id: number;
  code: string;
  name: string;
}

export interface Position {
  id: number;
  name: string;
}

export interface Authority {
  id: number;
  code: string;
  name: string;
}

export interface UserSetting {
  language: string;
  theme: string;
  darkMode: boolean;
}

export interface UserSettingBody {
  language: string;
  theme: string;
  darkMode: Boolean;
}

export const authAPI = createApi({
  reducerPath: "authAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_HOST,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem(LocalStorageItemKey.TOKEN);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["me"],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginBody>({
      query: ({ username, password }) => ({
        url: "auth/login",
        method: "POST",
        body: {
          username,
          password,
        },
      }),
      invalidatesTags: ["me"],
    }),
    me: builder.query<UserResponse, void>({
      query: () => ({
        url: "auth/me",
      }),
      providesTags: ["me"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: "auth/logout", method: "POST" }),
      invalidatesTags: ["me"],
    }),
    userSetting: builder.mutation<any, UserSettingBody>({
      query: (userSettingBody) => ({
        url: "user/user-setting/update",
        method: "PUT",
        body: userSettingBody,
      }),
      invalidatesTags: ["me"],
    }),
  }),
});

export const {
  useLoginMutation,
  useMeQuery,
  useLazyMeQuery,
  useLogoutMutation,
  useUserSettingMutation
} = authAPI;
