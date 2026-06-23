if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/home/ravel/.gradle/caches/transforms-4/cefb54a634315abd1549e9f0192d60fb/transformed/hermes-android-0.74.0-debug/prefab/modules/libhermes/libs/android.arm64-v8a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/ravel/.gradle/caches/transforms-4/cefb54a634315abd1549e9f0192d60fb/transformed/hermes-android-0.74.0-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

